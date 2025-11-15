export function Notifications() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="card text-center py-12">
          <div className="w-20 h-20 bg-pharmacy-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-pharmacy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
          <p className="text-lg text-gray-600 mb-6">
            Your order has been received and is being processed.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            You will receive updates about your order status. Check back here for notifications.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/pharmacies" className="btn-primary">
              Continue Shopping
            </a>
            <a href="/" className="btn-secondary">
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

