'use client';

const ShippingInfo = () => {
    return (
        <div className="max-w-screen-xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Shipping Information</h1>
            <p>We offer free shipping on orders over $100. All orders are processed within 1-2 business days. You will receive a tracking number once your order has shipped.</p>
            <h2 className="font-semibold mt-4">Shipping Methods:</h2>
            <ul className="list-disc ml-6">
                <li>Standard Shipping (3-5 business days)</li>
                <li>Express Shipping (1-2 business days)</li>
                <li>International Shipping (varies by location)</li>
            </ul>
        </div>
    );
};

export default ShippingInfo;
