import { useEffect, useMemo, useState } from "react";

type ContactRequest = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
  createdAt: string;
  updatedAt: string;
};

type StaffMember = {
  id: number;
  email: string;
  role: string;
};

type ContactAdminProps = {
  userId: number;
  className?: string;
};

const RAW_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL ??
  "http://localhost:4000/api";

const API_BASE_URL = RAW_BASE_URL.endsWith("/")
  ? RAW_BASE_URL.slice(0, -1)
  : RAW_BASE_URL;

export default function ContactControl({ userId, className }: ContactAdminProps) {
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState<ContactRequest | null>(null);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [contactsError, setContactsError] = useState<string | null>(null);
  const [staffError, setStaffError] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const canAct = useMemo(() => Number.isFinite(userId) && Number(userId) > 0, [userId]);

  useEffect(() => {
    let isMounted = true;

    async function fetchContacts() {
      setLoadingContacts(true);
      setContactsError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/contact`);
        const data = (await response.json()) as ContactRequest[] | { message?: string };

        if (!response.ok) {
          const message = "message" in data && data.message
            ? data.message
            : "Failed to fetch contact requests.";
          throw new Error(message);
        }

        if (!isMounted) return;
        setContacts(data as ContactRequest[]);
        setContactsError(null);
      } catch (err) {
        if (!isMounted) return;
        const message = err instanceof Error ? err.message : "Unexpected error fetching contact requests.";
        setContactsError(message);
      } finally {
        if (isMounted) {
          setLoadingContacts(false);
        }
      }
    }

    fetchContacts();

    return () => {
      isMounted = false;
    };
  }, [refreshIndex]);

  useEffect(() => {
    if (!canAct) {
      setStaffError("Invalid admin user id provided.");
      return;
    }

    setStaffError(null);

    let isMounted = true;

    async function fetchStaff() {
      setLoadingStaff(true);

      try {
        const response = await fetch(
          `${API_BASE_URL}/users?adminId=${encodeURIComponent(String(userId))}`
        );
        const data = (await response.json()) as StaffMember[] | { message?: string };

        if (!response.ok) {
          const message = "message" in data && data.message
            ? data.message
            : "Failed to fetch user roster.";
          throw new Error(message);
        }

        if (!isMounted) return;
        setStaff(data as StaffMember[]);
      } catch (err) {
        if (!isMounted) return;
        const message = err instanceof Error ? err.message : "Unexpected error fetching user roster.";
        setStaffError(message);
      } finally {
        if (isMounted) {
          setLoadingStaff(false);
        }
      }
    }

    fetchStaff();

    return () => {
      isMounted = false;
    };
  }, [userId, canAct]);

  const handleRefresh = () => setRefreshIndex((value) => value + 1);

  const filteredContacts = useMemo(() => {
    if (!searchTerm.trim()) {
      return contacts;
    }

    const term = searchTerm.trim().toLowerCase();
    return contacts.filter((contact) => {
      return (
        contact.name.toLowerCase().includes(term) ||
        contact.email.toLowerCase().includes(term) ||
        contact.phoneNumber.toLowerCase().includes(term) ||
        contact.subject.toLowerCase().includes(term) ||
        contact.message.toLowerCase().includes(term)
      );
    });
  }, [contacts, searchTerm]);

  const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleString();
  };

  const groupStaffByRole = useMemo(() => {
    return staff.reduce<Record<string, StaffMember[]>>((acc, member) => {
      const role = member.role ?? "UNKNOWN";
      if (!acc[role]) {
        acc[role] = [];
      }
      acc[role].push(member);
      return acc;
    }, {});
  }, [staff]);

  return (
    <section className={`w-full bg-white border border-slate-200 rounded-xl shadow-sm ${className ?? ""}`}>
      <header className="flex flex-col gap-2 px-6 py-5 border-b border-slate-200 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Contact Requests</h2>
          <p className="text-sm text-slate-500">Review incoming messages and assign follow ups.</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name, email, or subject"
            className="w-64 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loadingContacts}
            className={`px-3 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition ${
              loadingContacts ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            Refresh
          </button>
        </div>
      </header>

      {contactsError && (
        <div className="px-6 pt-4">
          <div className="mb-3 px-4 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
            {contactsError}
          </div>
        </div>
      )}

      {!canAct && (
        <div className="px-6 py-4 text-sm text-slate-600">
          Provide a valid admin user id to manage contact requests.
        </div>
      )}

      {canAct && (
        <div className="grid gap-6 px-6 py-6 lg:grid-cols-3">
          <div className="lg:col-span-2 overflow-x-auto border border-slate-200 rounded-xl">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Requester</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {loadingContacts ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-6 text-center text-sm text-slate-500">
                      Loading contact requests...
                    </td>
                  </tr>
                ) : filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-6 text-center text-sm text-slate-500">
                      No contact requests found.
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 text-sm text-slate-800">
                        <div className="font-semibold text-slate-800">{contact.name}</div>
                        <div className="text-xs text-slate-500">{contact.email}</div>
                        <div className="text-xs text-slate-500">{contact.phoneNumber}</div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700">
                        <div className="font-medium text-slate-800">{contact.subject}</div>
                        <div className="text-xs text-slate-500 mt-1 line-clamp-2">{contact.message}</div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500">{formatDate(contact.createdAt)}</td>
                      <td className="px-5 py-4 text-sm">
                        <button
                          type="button"
                          onClick={() => setSelectedContact(contact)}
                          className="px-4 py-1.5 text-sm font-semibold rounded-lg text-white bg-red-500 hover:bg-red-600 transition"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <aside className="border border-slate-200 rounded-xl p-5 bg-slate-50/60">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Team Directory</h3>
            {loadingStaff ? (
              <p className="text-sm text-slate-500">Loading team members...</p>
            ) : staff.length === 0 ? (
              <p className="text-sm text-slate-500">No users available.</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupStaffByRole).map(([role, members]) => (
                  <div key={role}>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                      {role.replace(/_/g, " ")}
                    </div>
                    <ul className="space-y-1">
                      {members.map((member) => (
                        <li key={member.id} className="text-sm text-slate-700">
                          {member.email}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      )}

      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl">
            <div className="px-6 py-5 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">Contact Details</h3>
              <p className="mt-1 text-sm text-slate-500">
                Submitted on {formatDate(selectedContact.createdAt)}
              </p>
            </div>
            <div className="px-6 py-5 space-y-4 text-sm">
              <div>
                <span className="uppercase text-xs font-semibold tracking-wide text-slate-500">Name</span>
                <div className="text-slate-800">{selectedContact.name}</div>
              </div>
              <div>
                <span className="uppercase text-xs font-semibold tracking-wide text-slate-500">Email</span>
                <div className="text-slate-800">{selectedContact.email}</div>
              </div>
              <div>
                <span className="uppercase text-xs font-semibold tracking-wide text-slate-500">Phone</span>
                <div className="text-slate-800">{selectedContact.phoneNumber}</div>
              </div>
              <div>
                <span className="uppercase text-xs font-semibold tracking-wide text-slate-500">Subject</span>
                <div className="text-slate-800">{selectedContact.subject}</div>
              </div>
              <div>
                <span className="uppercase text-xs font-semibold tracking-wide text-slate-500">Message</span>
                <div className="mt-1 whitespace-pre-wrap text-slate-700">{selectedContact.message}</div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => setSelectedContact(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}



