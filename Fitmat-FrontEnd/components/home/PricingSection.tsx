import React, { useState } from 'react';
import { Button, FadeIn } from '../common';
interface PricingPlan {
  name: string;
  title: string;
  badge: string;
  price: string;
  period: string;
  features: Array<{
    text: string;
    included: boolean;
  }>;
  buttonText: string;
}

type SelectedPlan = {
  name: string;
  title: string;
  amountFormatted: string;
  qrCodeUrl: string;
};

export default function PricingSection() {
  const phoneNumber =
    process.env.NEXT_PUBLIC_PROMPTPAY_PHONE ?? "0812345678";
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openPaymentModal = (plan: PricingPlan) => {
    const sanitizedPrice = plan.price.replace(/[^\d.]/g, "");
    const amountNumber = Number.parseFloat(sanitizedPrice);
    const amountFormatted =
      Number.isFinite(amountNumber) && amountNumber > 0
        ? amountNumber.toFixed(2)
        : "0.00";
    const qrCodeUrl = `https://promptpay.io/${phoneNumber}/${amountFormatted}.png`;

    setSelectedPlan({
      name: plan.name,
      title: plan.title,
      amountFormatted,
      qrCodeUrl,
    });
    setIsModalOpen(true);
  };

  const closePaymentModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  const plans: PricingPlan[] = [
    {
      name: 'bronze',
      title: 'Bronze',
      badge: 'STARTER',
      price: '499',
      period: '/ สัปดาห์',
      features: [
        { text: 'เทรนเนอร์ออนไลน์สัปดาห์ละ 1 ครั้ง', included: true },
        { text: 'วิดีโอท่าออกกำลังกายเฉพาะบุคคล', included: true },
        { text: 'ปรึกษาโภชนาการ', included: false },
        { text: 'ติดตามพัฒนาการรายเดือน', included: false },
      ],
      buttonText: 'เลือกแพ็กเกจนี้',
    },
    {
      name: 'gold',
      title: 'Gold',
      badge: 'POPULAR',
      price: '1,299',
      period: '/ สัปดาห์',
      features: [
        { text: 'เทรนเนอร์ออนไลน์ 3 ครั้ง/สัปดาห์', included: true },
        { text: 'วิดีโอท่าออกกำลังกายเฉพาะบุคคล', included: true },
        { text: 'ปรึกษาโภชนาการ 1 ครั้ง/สัปดาห์', included: true },
        { text: 'ติดตามพัฒนาการรายเดือน', included: false },
      ],
      buttonText: 'เลือกแพ็กเกจยอดนิยม',
    },
    {
      name: 'platinum',
      title: 'Platinum',
      badge: 'ENTERPRISE',
      price: '2,999',
      period: '/ เดือน',
      features: [
        { text: 'เทรนเนอร์ตัวต่อตัว/ออนไลน์ไม่จำกัดครั้ง', included: true },
        { text: 'วิดีโอ/แผนการฝึกเฉพาะบุคคล', included: true },
        { text: 'ปรึกษาโภชนาการทุกสัปดาห์', included: true },
        { text: 'รายงานพัฒนาการทุกสัปดาห์', included: true },
      ],
      buttonText: 'เลือกแพ็กเกจพรีเมียม',
    },
  ];
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 via-white to-red-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-100 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-red-200 rounded-full opacity-15"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-red-50 rounded-full opacity-10"></div>
      </div>
      <div className="relative z-10">
        <FadeIn direction="up">
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-full font-bold text-base mb-6 shadow-lg">
              แพ็คเกจราคา
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
              เลือกแพ็คเกจที่
              <span className="block text-red-600">เหมาะกับคุณ</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              ราคาที่คุ้มค่า พร้อมบริการครบครัน เพื่อสุขภาพที่ดีของคุณ
            </p>
          </div>
        </FadeIn>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          {plans.map((plan, index) => (
          <FadeIn key={plan.name} direction="up" delay={200 + index * 200}>
            <div
              className={`bg-white rounded-3xl shadow-xl p-8 text-center relative group transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                plan.name === 'gold' ? 'ring-4 ring-red-200 ring-opacity-50 scale-105' : ''
              }`}
            >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className={`text-white px-6 py-3 rounded-full text-sm font-bold group-hover:ring-2 group-hover:ring-offset-2 transition-all duration-200 shadow-lg ${
                plan.name === 'gold' 
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 group-hover:ring-yellow-400' 
                  : 'bg-gradient-to-r from-red-500 to-red-600 group-hover:ring-red-500'
              }`}>
                {plan.badge}
              </span>
            </div>
            <h3 className={`text-2xl font-bold mt-6 mb-6 ${
              plan.name === 'gold' ? 'text-red-600' : 'text-gray-800'
            }`}>
              {plan.title}
            </h3>
            <ul className="space-y-3 mb-8 text-left">
              {plan.features.map((feature, index) => (
                <li
                  key={index}
                  className={`flex items-center ${
                    feature.included ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  <span className="mr-2">
                    {feature.included ? '✓' : '✗'}
                  </span>
                  {feature.text}
                </li>
              ))}
            </ul>
            <div className={`text-4xl font-bold mb-2 ${
              plan.name === 'gold' ? 'text-red-600' : 'text-gray-900'
            }`}>
              {plan.price} <span className="text-lg text-gray-600">{plan.period}</span>
            </div>
            <Button
              variant={plan.name === 'gold' ? 'primary' : 'danger'}
              size="lg"
              className={`w-full mb-4 shadow-lg hover:shadow-xl transition-all duration-300 ${
                plan.name === 'gold' 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
                  : ''
              }`}
              type="button"
              onClick={() => openPaymentModal(plan)}
            >
              {plan.buttonText}
            </Button>
            <p className="text-gray-400 text-sm">ยกเลิกได้ทุกเมื่อ</p>
            {/* Enhanced hover effects */}
            <div className={`pointer-events-none absolute inset-0 rounded-3xl border-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
              plan.name === 'gold' ? 'border-yellow-400' : 'border-red-500'
            }`}></div>
            {/* Glow effect for popular plan */}
            {plan.name === 'gold' && (
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-200/20 to-red-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            )}
          </div>
          </FadeIn>
          ))}
        </div>
      </div>

      {isModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closePaymentModal}
          ></div>
          <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={closePaymentModal}
              className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 text-gray-500 transition hover:bg-gray-200"
              aria-label="Close QR modal"
            >
              X
            </button>
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {selectedPlan.title} Plan
              </h3>
              <p className="text-gray-600">
                Amount: <span className="font-semibold text-gray-900">THB {selectedPlan.amountFormatted}</span>
              </p>
              <p className="text-sm text-gray-500">
                PromptPay number: {phoneNumber}
              </p>
              <div className="mx-auto flex h-64 w-64 items-center justify-center rounded-2xl border border-gray-200 bg-white p-4 shadow-inner">
                <img
                  src={selectedPlan.qrCodeUrl}
                  alt={`PromptPay QR for ${selectedPlan.title} plan`}
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="text-xs text-gray-400">
                Scan the QR code with your banking app to complete the payment.
              </p>
              <button
                type="button"
                onClick={closePaymentModal}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-red-600"
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



