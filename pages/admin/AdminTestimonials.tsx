import React from 'react';
import { useData } from '../../context/DataContext';
import { Check, Trash2, Star, UserCircle, X, ChevronsRight } from 'lucide-react';
import { Testimonial } from '../../types';

export const AdminTestimonials: React.FC = () => {
    const { testimonials, approveTestimonial, deleteTestimonial, allUsers, approveTestimonialEdit, rejectTestimonialEdit } = useData();

    const pendingTestimonials = testimonials.filter(t => t.status === 'pending');
    const pendingEdits = testimonials.filter(t => t.status === 'pending_edit');
    const approvedTestimonials = testimonials.filter(t => t.status === 'approved');

    const getAdvisorName = (id: string) => allUsers.find(u => u.id === id)?.name || 'Unknown Advisor';

    const renderStars = (rating: number) => {
        return (
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />
                ))}
            </div>
        );
    };

    // FIX: Define props interface and use React.FC to correctly type component with special props like 'key'.
    interface TestimonialCardProps {
        testimonial: Testimonial;
    }

    const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <UserCircle className="h-5 w-5 text-slate-400" />
                        <h4 className="font-bold text-slate-900">{testimonial.clientName}</h4>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">For: <span className="font-bold text-blue-600">{getAdvisorName(testimonial.advisorId)}</span></p>
                </div>
                {renderStars(testimonial.rating)}
            </div>
            <p className="text-sm text-slate-600 leading-relaxed flex-1 mb-4 italic">"{testimonial.reviewText}"</p>
            <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                <span className="text-xs text-slate-400 font-medium">{new Date(testimonial.date).toLocaleDateString()}</span>
                <div className="flex gap-2">
                    <button 
                        onClick={() => deleteTestimonial(testimonial.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                    {testimonial.status === 'pending' && (
                        <button 
                            onClick={() => approveTestimonial(testimonial.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold hover:bg-green-200 transition-colors"
                        >
                            <Check className="h-4 w-4" /> Approve
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
    
    // FIX: Define props interface and use React.FC to correctly type component with special props like 'key'.
    interface EditApprovalCardProps {
        testimonial: Testimonial;
    }

    const EditApprovalCard: React.FC<EditApprovalCardProps> = ({ testimonial }) => (
        <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-blue-300 shadow-sm flex flex-col">
             <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs text-slate-500 font-medium">Edit requested for testimonial by <span className="font-bold text-slate-700">{testimonial.clientName}</span></p>
                    <p className="text-xs text-slate-500 font-medium">Advisor: <span className="font-bold text-blue-600">{getAdvisorName(testimonial.advisorId)}</span></p>
                </div>
             </div>
             
             {/* Diff View */}
             <div className="space-y-4 mb-4">
                {/* Name */}
                <div className="grid grid-cols-3 gap-2 text-xs items-center">
                   <span className="font-bold text-slate-400">Client Name:</span>
                   <span className="bg-red-50 text-red-700 p-2 rounded-lg line-through">{testimonial.clientName}</span>
                   <span className="bg-green-50 text-green-800 p-2 rounded-lg font-bold flex items-center"><ChevronsRight className="h-3 w-3 mr-1"/>{testimonial.editedClientName}</span>
                </div>
                {/* Rating */}
                <div className="grid grid-cols-3 gap-2 text-xs items-center">
                   <span className="font-bold text-slate-400">Rating:</span>
                   <div className="bg-red-50 p-2 rounded-lg">{renderStars(testimonial.rating)}</div>
                   <div className="bg-green-50 p-2 rounded-lg flex items-center"><ChevronsRight className="h-3 w-3 mr-1"/>{renderStars(testimonial.editedRating || 0)}</div>
                </div>
                 {/* Review Text */}
                <div className="space-y-1">
                   <span className="text-xs font-bold text-slate-400">Review Text:</span>
                   <p className="bg-red-50 text-red-700 p-2 rounded-lg text-xs line-through">{testimonial.reviewText}</p>
                   <p className="bg-green-50 text-green-800 p-2 rounded-lg text-xs font-bold">{testimonial.editedReviewText}</p>
                </div>
             </div>
             
             <div className="mt-auto border-t border-slate-100 pt-4 flex justify-end gap-2">
                 <button 
                    onClick={() => rejectTestimonialEdit(testimonial.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200"
                 >
                    <X className="h-4 w-4" /> Reject Edit
                 </button>
                 <button 
                    onClick={() => approveTestimonialEdit(testimonial.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-200"
                 >
                    <Check className="h-4 w-4" /> Approve Edit
                 </button>
             </div>
        </div>
    );

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-2xl font-bold text-[#0B2240]">Manage Testimonials</h1>
                <p className="text-slate-500">Approve or deny new client reviews and advisor edits submitted via microsites.</p>
            </div>

            {/* Pending Edits */}
            {pendingEdits.length > 0 && (
                <div className="bg-blue-50/50 border border-dashed border-blue-300 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-blue-800 mb-4">Edited Testimonials Pending Approval ({pendingEdits.length})</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pendingEdits.map(t => <EditApprovalCard key={t.id} testimonial={t} />)}
                    </div>
                </div>
            )}

            {/* Pending Reviews */}
            <div className="bg-yellow-50/50 border border-dashed border-yellow-300 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-yellow-800 mb-4">New Testimonials Pending Approval ({pendingTestimonials.length})</h2>
                {pendingTestimonials.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingTestimonials.map(t => <TestimonialCard key={t.id} testimonial={t} />)}
                    </div>
                ) : (
                    <p className="text-sm text-yellow-700 text-center py-8">No new testimonials are waiting for approval.</p>
                )}
            </div>

            {/* Approved Reviews */}
            <div>
                <h2 className="text-lg font-bold text-slate-700 mb-4">Approved & Live ({approvedTestimonials.length})</h2>
                 {approvedTestimonials.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {approvedTestimonials.map(t => <TestimonialCard key={t.id} testimonial={t} />)}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500 text-center py-8 bg-slate-50 rounded-lg">No testimonials have been approved yet.</p>
                )}
            </div>
        </div>
    );
};
