import React, { useState, useEffect } from 'react';

export default function TestimonialsView() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [form, setForm] = useState({
    name: '',
    role: 'Verified Policyholder',
    city: 'Mumbai',
    rating: 5,
    planUsed: 'Standard Plan',
    savings: '₹14,000/year',
    comment: '',
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/testimonials');
      const data = await res.json();
      if (data.success && data.testimonials) {
        setReviews(data.testimonials);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setReviews([data.testimonial, ...reviews]);
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
          setModalOpen(false);
          setForm({
            name: '',
            role: 'Verified Policyholder',
            city: 'Delhi',
            rating: 5,
            planUsed: 'Standard Plan',
            savings: '₹14,000/year',
            comment: '',
          });
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="py-16 gradient-bg min-h-[calc(100vh-70px)] text-white">
      <div className="container mx-auto px-6">
        {/* Header from Review.html */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow">
            What Our Customers Say
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Real stories from people who saved money on their medical insurance with Arogya Kavaj.
          </p>

          <button
            onClick={() => setModalOpen(true)}
            className="mt-8 bg-white text-indigo-700 px-8 py-3.5 rounded-full font-bold shadow-xl hover:bg-slate-100 transition cursor-pointer text-base"
          >
            + Add Your Review
          </button>
        </div>

        {/* Reviews Grid from Review.html */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-xl text-slate-800 flex flex-col justify-between transition hover:-translate-y-2"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400 text-lg">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <i key={i} className="fas fa-star mr-1"></i>
                    ))}
                  </div>
                  <span className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full font-semibold">
                    {rev.planUsed || 'Standard Plan'}
                  </span>
                </div>

                <p className="text-slate-600 italic text-sm leading-relaxed mb-6">
                  "{rev.comment}"
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold mr-3">
                    {rev.name ? rev.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{rev.name}</h4>
                    <span className="text-xs text-slate-500">{rev.role || 'Policyholder'} • {rev.city || 'India'}</span>
                  </div>
                </div>
                {rev.savings && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    {rev.savings}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal for adding review */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl relative text-slate-900 animate-fade-in">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
              >
                <i className="fas fa-times"></i>
              </button>

              <h3 className="text-2xl font-bold mb-4">Add Your Review</h3>

              {submitSuccess ? (
                <div className="p-4 bg-emerald-50 text-emerald-700 rounded-lg text-center font-bold">
                  Thank you! Your review has been saved in MongoDB Atlas.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold block mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 border border-slate-300 rounded-lg outline-none text-sm"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Amit Patel"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold block mb-1">City</label>
                      <input
                        type="text"
                        className="w-full p-3 border border-slate-300 rounded-lg outline-none text-sm"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        placeholder="e.g. Pune"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1">Rating</label>
                      <select
                        className="w-full p-3 border border-slate-300 rounded-lg outline-none text-sm"
                        value={form.rating}
                        onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                      >
                        <option value="5">★★★★★ (5 Stars)</option>
                        <option value="4">★★★★☆ (4 Stars)</option>
                        <option value="3">★★★☆☆ (3 Stars)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-1">Your Review</label>
                    <textarea
                      rows="3"
                      required
                      className="w-full p-3 border border-slate-300 rounded-lg outline-none text-sm"
                      value={form.comment}
                      onChange={(e) => setForm({ ...form, comment: e.target.value })}
                      placeholder="How did Arogya Kavaj help you with predictions or claims?"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-full font-semibold transition cursor-pointer"
                  >
                    Submit Review to MongoDB Atlas
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
