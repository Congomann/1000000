import React from 'react';
import { useData } from '../context/DataContext';
import { Star } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { testimonials } = useData();
  const approvedTestimonials = testimonials.filter(t => t.status === 'approved').slice(0, 3);

  if (approvedTestimonials.length === 0) return null;

  return (
    <div className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-slate-600">
            Don't just take our word for it. Hear from those who have experienced the New Holland difference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {approvedTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < (testimonial.editedRating || testimonial.rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-slate-700 leading-relaxed mb-8 italic">
                "{testimonial.editedReviewText || testimonial.reviewText}"
              </p>
              <div className="mt-auto">
                <p className="font-bold text-slate-900">
                  {testimonial.editedClientName || testimonial.clientName}
                </p>
                <p className="text-sm text-slate-500">Valued Client</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
