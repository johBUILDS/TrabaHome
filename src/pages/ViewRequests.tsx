// @ts-nocheck
import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BellIcon, HammerIcon, CalendarIcon, LockIcon } from "../Icons";

export default function MyRequests() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("All");

  // --- MODAL STATES ---
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRequestAgainModalOpen, setIsRequestAgainModalOpen] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isViewReviewModalOpen, setIsViewReviewModalOpen] = useState(false);
  const [isCompleteConfirmOpen, setIsCompleteConfirmOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  
  // Rating States
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const tabs = ["All", "Pending", "Accepted", "Completed", "Cancelled", "Declined"];
  const incomingRequest = location.state;
  const [localRequests, setLocalRequests] = useState(null);

  const allRequests = useMemo(() => {
    if (localRequests) return localRequests;

    const baseRequests = [
      {
        id: 1,
        workerName: "Mang Berto",
        role: "Carpenter",
        status: "Accepted",
        statusMessage: "Good news! You can now contact your worker. Click View More.",
        dateSent: "Jan 14, 3:00 PM",
        acceptedAt: "Jan 15, 10:00 AM",
        completedAt: null,
        image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=600",
        location: "Mangaldan, Pangasinan",
        description: "sira pinto koooooo",
        schedule: "Not specified",
        email: "mangberto@gmail.com",
        facebook: "Berto Berto",
        phone: "09223742374",
        userRating: null,
        userReview: ""
      },
      {
        id: 3,
        workerName: "Mang Berto",
        role: "Carpenter",
        status: "Declined",
        statusMessage: "Reason: Fully booked on the requested date.",
        dateSent: "Jan 14, 3:00 PM",
        declinedAt: "Jan 14, 9:27 PM",
        image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=600",
        location: "Mangaldan, Pangasinan",
        description: "sira pinto koooooo",
        schedule: "Not specified",
        declineReason: "Fully booked on the requested date."
      }
    ];

    let finalRequests = baseRequests;
    if (incomingRequest) {
      const newRequest = {
        id: Date.now(),
        workerName: incomingRequest.workerName,
        role: incomingRequest.role,
        status: "Pending",
        statusMessage: "We sent your request via SMS.",
        subMessage: "Once the worker accepts, both of you will be able to see each other's contact details so you can coordinate directly.",
        dateSent: "Jan 14, 3:00 PM",
        image: incomingRequest.image,
        location: incomingRequest.location || "Mangaldan, Pangasinan",
        description: incomingRequest.description || "sira pinto koooooo",
        schedule: "Not specified",
      };
      finalRequests = [newRequest, ...baseRequests];
    }
    setLocalRequests(finalRequests);
    return finalRequests;
  }, [incomingRequest, localRequests]);

  const filteredRequests = allRequests.filter(req => 
    activeTab === "All" || req.status === activeTab || (activeTab === "Completed" && req.status === "Rated")
  );

  const selectedRequest = allRequests.find(r => r.id === selectedRequestId);

  // --- HANDLERS ---
  const handleConfirmCancel = () => {
    const reasonText = cancelReason === "Other (state reason)" ? otherReason : cancelReason;
    const now = new Date();
    const formattedDate = `${now.toLocaleString('default', { month: 'short' })} ${now.getDate()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setLocalRequests(prev => prev.map(req => {
      if (req.id === selectedRequestId) {
        return { 
          ...req, 
          status: "Cancelled", 
          userCancelReason: reasonText,
          cancelledAt: formattedDate
        };
      }
      return req;
    }));
    setIsCancelModalOpen(false);
  };

  const handleRequestAgain = () => {
    setLocalRequests(prev => prev.map(req => {
      if (req.id === selectedRequestId) {
        return { 
          ...req, 
          status: "Pending", 
          statusMessage: "We sent your request via SMS.",
          subMessage: "Once the worker accepts, both of you will be able to see each other's contact details so you can coordinate directly.",
          cancelledAt: null,
          userCancelReason: null
        };
      }
      return req;
    }));
    setIsRequestAgainModalOpen(false);
    setIsDetailModalOpen(false);
    setActiveTab("Pending");
  };

  const handleMarkComplete = (id) => {
    const now = new Date();
    const formattedDate = `${now.toLocaleString('default', { month: 'short' })} ${now.getDate()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    
    setLocalRequests(prev => prev.map(req => 
      req.id === id ? { 
        ...req, 
        status: "Completed", 
        statusMessage: "Service completed. You can now rate your worker.",
        completedAt: formattedDate 
      } : req
    ));
    setIsDetailModalOpen(false);
    setIsCompleteConfirmOpen(false);
    setActiveTab("Completed");
  };

  const handleSubmitReview = () => {
    setLocalRequests(prev => prev.map(req => 
      req.id === selectedRequestId ? { 
        ...req, 
        userRating: rating,
        userReview: review
      } : req
    ));
    setIsRateModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const handleCloseSuccess = () => {
    setLocalRequests(prev => prev.map(req => 
      req.id === selectedRequestId ? { 
        ...req, 
        status: "Rated",
        statusMessage: "You have successfully rated this worker."
      } : req
    ));
    setIsSuccessModalOpen(false);
    setRating(0);
    setReview("");
  };

  return (
    <div className="w-full min-h-screen bg-[#FDF8F4] text-[#0B3B68] font-sans flex flex-col">
      <header className="flex items-center justify-between px-6 md:px-10 py-6 max-w-7xl mx-auto w-full">
        <img 
          src="/assets/Logo.png"
          alt="TrabaHome"
          className="h-8 w-auto cursor-pointer"
          onClick={() => navigate('/home')}
        />
        <div className="p-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer"><BellIcon className="w-6 h-6 text-[#0B3B68]" /></div>
      </header>

      <main className="flex-grow w-full max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">My Requests</h2>

        {/* Tab Navigation (Mirrored from image_7f09dd.png) */}
        <div className="flex bg-white rounded-lg shadow-sm mb-6 border border-gray-100 p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[80px] py-2 text-xs font-semibold rounded-md transition-all ${activeTab === tab ? "text-[#0B3B68] border-b-2 border-[#0B3B68]" : "text-gray-400"}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredRequests.map((req) => (
            /* Card UI Mirrored from Screenshots */
            <div key={req.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col relative transition-all hover:shadow-md">
              <div className="flex gap-5">
                <div className="w-24 h-24 flex-shrink-0">
                  <img src={req.image} alt={req.workerName} className="w-full h-full object-cover rounded-xl shadow-sm" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <h3 className="text-lg font-bold text-[#0B3B68]">{req.workerName}</h3>
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                    </div>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="flex items-center gap-1.5 text-[10px] font-bold bg-blue-50 text-blue-600 px-3 py-0.5 rounded-full w-fit mb-3">
                    <HammerIcon className="w-3 h-3" /> {req.role}
                  </div>

                  {/* Status & Message */}
                  <div className="flex flex-col gap-1 mb-2">
                    <span className={`text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-tighter w-fit ${
                      req.status === 'Cancelled' || req.status === 'Declined' ? 'bg-[#FF9494] text-white' : 
                      (req.status === 'Accepted' || req.status === 'Completed' || req.status === 'Rated') ? 'bg-[#C6F6D5] text-[#2F855A]' : 
                      'bg-[#FFC107] text-white'
                    }`}>
                      {req.status === "Rated" ? "Completed" : req.status}
                    </span>
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed max-w-[90%]">
                        {req.status === "Rated" ? "Reviewed" : req.statusMessage}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold mt-2">
                    <CalendarIcon className="w-3.5 h-3.5" /> 
                    {req.status === 'Completed' || req.status === 'Rated' ? `Completed: ${req.completedAt || req.dateSent}` : 
                     req.status === 'Accepted' ? `Accepted: ${req.acceptedAt}` : 
                     req.status === 'Cancelled' ? `Cancelled: ${req.cancelledAt}` : 
                     req.status === 'Declined' ? `Declined: ${req.declinedAt}` : `Sent: ${req.dateSent}`}
                  </div>
                </div>
              </div>

              {/* Action Buttons Mirrored Styling */}
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-50">
                <button 
                  onClick={() => { setSelectedRequestId(req.id); setIsDetailModalOpen(true); }} 
                  className="px-8 py-2 border-2 border-[#0B3B68] text-[#0B3B68] rounded-full text-[11px] font-bold hover:bg-gray-50 transition-colors"
                >
                  View More
                </button>
                
                {req.status === 'Rated' ? (
                  <button onClick={() => { setSelectedRequestId(req.id); setIsViewReviewModalOpen(true); }} className="px-8 py-2 border-2 border-[#0B3B68] text-[#0B3B68] rounded-full text-[11px] font-bold">View Review</button>
                ) : req.status === 'Completed' ? (
                  <button onClick={() => { setSelectedRequestId(req.id); setIsRateModalOpen(true); }} className="px-10 py-2 bg-[#FF824D] text-white rounded-full text-[11px] font-bold shadow-sm">Rate</button>
                ) : req.status === 'Accepted' ? (
                  <button onClick={() => { setSelectedRequestId(req.id); setIsCompleteConfirmOpen(true); }} className="px-8 py-2 bg-[#00AF91] text-white rounded-full text-[11px] font-bold shadow-sm">Mark as complete</button>
                ) : req.status === 'Cancelled' ? (
                  <button onClick={() => { setSelectedRequestId(req.id); setIsRequestAgainModalOpen(true); }} className="px-8 py-2 bg-[#0B3B68] text-white rounded-full text-[11px] font-bold shadow-sm">Request Again</button>
                ) : req.status === 'Declined' ? (
                  <button onClick={() => navigate('/search')} className="px-8 py-2 bg-[#0B3B68] text-white rounded-full text-[11px] font-bold shadow-sm">Find Another Worker</button>
                ) : (
                  <button onClick={() => { setSelectedRequestId(req.id); setIsCancelModalOpen(true); }} className="px-8 py-2 border-2 border-[#FF5252] text-[#FF5252] rounded-full text-[11px] font-bold hover:bg-red-50">Cancel Request</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- MODAL: VIEW ACCURATE REVIEW --- */}
      {isViewReviewModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setIsViewReviewModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-[380px] rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-bold">Your Review</h3>
              <button onClick={() => setIsViewReviewModalOpen(false)} className="text-gray-400">âœ•</button>
            </div>
            <div className="p-8 text-center">
              <div className="flex flex-col items-center mb-4">
                <img src={selectedRequest.image} className="w-14 h-14 rounded-lg object-cover mb-2" alt="" />
                <h4 className="text-sm font-bold">{selectedRequest.workerName}</h4>
              </div>

              <div className="flex justify-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`text-2xl ${star <= selectedRequest.userRating ? "text-amber-400" : "text-gray-200"}`}>â˜…</span>
                ))}
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-[12px] text-gray-600 italic mb-6 text-left border border-gray-100">
                "{selectedRequest.userReview || "No written review provided."}"
              </div>

              <button 
                onClick={() => setIsViewReviewModalOpen(false)}
                className="w-full py-3 bg-[#0B3B68] text-white rounded-full text-xs font-bold uppercase"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: RATE & REVIEW --- */}
      {isRateModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setIsRateModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-[380px] rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-bold">Request Details</h3>
              <button onClick={() => setIsRateModalOpen(false)} className="text-gray-400">âœ•</button>
            </div>
            <div className="p-8 text-center">
              <div className="flex flex-col items-center mb-4">
                <img src={selectedRequest.image} className="w-14 h-14 rounded-lg object-cover mb-2" alt="" />
                <h4 className="text-sm font-bold flex items-center gap-1">
                  {selectedRequest.workerName}
                  <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                  </div>
                </h4>
                <div className="flex items-center gap-1 text-[9px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                  <HammerIcon className="w-2.5 h-2.5" /> {selectedRequest.role}
                </div>
              </div>

              <p className="text-[13px] font-bold mb-4">How was your experience with {selectedRequest.workerName}?</p>
              
              <div className="flex justify-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} className="text-3xl focus:outline-none">
                    <span className={star <= rating ? "text-amber-400" : "text-gray-200"}>â˜…</span>
                  </button>
                ))}
              </div>

              <textarea 
                className="w-full bg-gray-100 rounded-xl p-4 text-[11px] min-h-[100px] mb-6 focus:outline-none placeholder:text-gray-400"
                placeholder="Write your review here..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />

              <button 
                onClick={handleSubmitReview}
                className="w-full py-3 bg-[#00AF91] text-white rounded-full text-xs font-bold uppercase tracking-wide mb-4 shadow-sm"
              >
                Submit Review
              </button>
              
              <p className="text-[9px] text-gray-400 flex items-center justify-center gap-1">
                <span className="text-[#00AF91]">âœ”</span> Thank you for helping others by sharing a feedback!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: SUCCESS TOAST --- */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={handleCloseSuccess}></div>
          <div className="relative bg-white w-full max-w-[380px] rounded-2xl shadow-xl p-10 text-center">
            <button onClick={handleCloseSuccess} className="absolute top-4 right-4 text-gray-400">âœ•</button>
            <div className="flex justify-center mb-6">
              <div className="relative">
                <span className="text-5xl">âœ¨</span>
                <div className="absolute -top-2 -right-2 bg-[#00AF91] p-2 rounded-lg">
                   <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-bold mb-2">Thank you for your feedback!</h3>
            <p className="text-[11px] text-gray-500 mb-8 leading-relaxed">
              Your review helps other homeowners find trusted workers.
            </p>
            <button 
              onClick={handleCloseSuccess}
              className="w-full py-3 bg-[#00AF91] text-white rounded-full text-xs font-bold uppercase tracking-wide mb-3"
            >
              Done
            </button>
            <button 
              onClick={() => {
                handleCloseSuccess();
                navigate('/search', { state: selectedRequest });
              }} 
              className="text-[11px] text-[#0B3B68] font-bold underline"
            >
              View Worker Profile
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL: VIEW MORE (MIRRORED FROM SCREENSHOTS) --- */}
      {isDetailModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setIsDetailModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-[380px] rounded-2xl shadow-xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-[13px] font-bold flex items-center gap-2">ðŸ“„ Request Details</h3>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-gray-400">âœ•</button>
            </div>

            <div className="p-6 max-h-[85vh] overflow-y-auto">
              {/* Profile Bar (Mirrored) */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                  <img src={selectedRequest.image} className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h4 className="text-[14px] font-bold text-[#0B3B68]">{selectedRequest.workerName}</h4>
                    <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-bold bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full w-fit">
                    <HammerIcon className="w-2.5 h-2.5" /> {selectedRequest.role}
                  </div>
                </div>
              </div>

              {/* Status Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Status</span>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${
                      selectedRequest.status === 'Declined' || selectedRequest.status === 'Cancelled' ? 'bg-[#FF9494]' : 
                      (selectedRequest.status === 'Accepted' || selectedRequest.status === 'Completed' || selectedRequest.status === 'Rated') ? 'bg-[#2F855A]' : 
                      'bg-[#FFC107]'
                    }`}></div>
                    <span className={`text-[11px] font-bold ${
                      selectedRequest.status === 'Declined' || selectedRequest.status === 'Cancelled' ? 'text-[#FF5252]' : 
                      (selectedRequest.status === 'Accepted' || selectedRequest.status === 'Completed' || selectedRequest.status === 'Rated') ? 'text-[#2F855A]' : 
                      'text-[#FFC107]'
                    }`}>
                      {selectedRequest.status === "Rated" ? "Completed" : selectedRequest.status}
                    </span>
                  </div>
                </div>
                
                <p className="text-[11px] text-gray-500 leading-tight">
                  {selectedRequest.statusMessage}
                </p>

                {selectedRequest.status === 'Pending' && (
                  <div className="flex gap-2 p-3 bg-gray-50 rounded-xl mt-3 border border-gray-100">
                    <LockIcon className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    <p className="text-[10px] text-gray-400 italic leading-snug">{selectedRequest.subMessage}</p>
                  </div>
                )}
              </div>

              {/* Contact Information (Image_7f09bf.png & image_7f099d.png) */}
              {(selectedRequest.status === 'Accepted' || selectedRequest.status === 'Completed' || selectedRequest.status === 'Rated') && (
                <div className="mb-6 space-y-2 border-t border-gray-100 pt-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Contact Information:</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[11px] text-gray-700">
                      <span className="text-blue-500">âœ‰ï¸</span> {selectedRequest.email}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-700">
                      <span className="text-blue-600 font-bold">f</span> {selectedRequest.facebook}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-700">
                      <span className="text-green-500">ðŸ“ž</span> {selectedRequest.phone}
                    </div>
                  </div>
                </div>
              )}

              {/* Content Fields */}
              <div className="space-y-5 border-t border-gray-100 pt-4">
                <div>
                  <label className="text-[11px] font-bold text-[#0B3B68] block mb-2">Problem Description</label>
                  <div className="bg-[#EFEFEF] rounded-xl p-4 text-[11px] text-gray-600 italic min-h-[80px]">
                    "{selectedRequest.description}"
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-[#0B3B68] block mb-0.5">Preferred Schedule</label>
                    <p className="text-[11px] text-gray-500 italic">{selectedRequest.schedule}</p>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#0B3B68] block mb-0.5">Location</label>
                    <p className="text-[11px] text-gray-500">{selectedRequest.location}</p>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#0B3B68] block mb-0.5">
                      {selectedRequest.status === 'Declined' ? 'Declined On' : selectedRequest.status === 'Cancelled' ? 'Cancelled On' : selectedRequest.status === 'Accepted' ? 'Accepted On' : 'Sent On'}
                    </label>
                    <p className="text-[11px] text-gray-500">
                      {selectedRequest.status === 'Declined' ? selectedRequest.declinedAt : selectedRequest.status === 'Cancelled' ? selectedRequest.cancelledAt : selectedRequest.dateSent}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons (Mirrored colors from screenshots) */}
              <div className="mt-8">
                {selectedRequest.status === 'Rated' ? (
                   <button onClick={() => setIsDetailModalOpen(false)} className="w-full py-3 bg-[#0B3B68] text-white rounded-full text-[12px] font-bold shadow-sm">Done</button>
                ) : selectedRequest.status === 'Completed' ? (
                  <button onClick={() => { setIsDetailModalOpen(false); setIsRateModalOpen(true); }} className="w-full py-3 bg-[#FF824D] text-white rounded-full text-[12px] font-bold shadow-sm">Rate</button>
                ) : selectedRequest.status === 'Accepted' ? (
                  <button onClick={() => { setIsCompleteConfirmOpen(true); setIsDetailModalOpen(false); }} className="w-full py-3 bg-[#00AF91] text-white rounded-full text-[12px] font-bold shadow-sm">Mark as complete</button>
                ) : selectedRequest.status === 'Declined' ? (
                  <button onClick={() => { setIsDetailModalOpen(false); navigate('/search'); }} className="w-full py-3 bg-[#0B3B68] text-white rounded-full text-[12px] font-bold shadow-sm">Find Another Worker</button>
                ) : selectedRequest.status === 'Cancelled' ? (
                  <button onClick={() => { setIsDetailModalOpen(false); setIsRequestAgainModalOpen(true); }} className="w-full py-3 bg-[#0B3B68] text-white rounded-full text-[12px] font-bold shadow-sm">Request Again</button>
                ) : (
                  <button onClick={() => { setIsDetailModalOpen(false); setIsCancelModalOpen(true); }} className="w-full py-2.5 border-2 border-[#FF5252] text-[#FF5252] rounded-full text-[12px] font-bold uppercase hover:bg-red-50 transition-colors">Cancel Request</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: MARK AS COMPLETE CONFIRMATION --- */}
      {isCompleteConfirmOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={() => setIsCompleteConfirmOpen(false)}></div>
          <div className="relative bg-white w-full max-w-[340px] rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">âœ…</div>
            <h3 className="text-lg font-bold">Complete Service?</h3>
            <p className="text-[12px] text-gray-500 mt-2 mb-8">Has the worker finished the job? This will move the request to your completed list.</p>
            <div className="flex gap-3">
              <button onClick={() => setIsCompleteConfirmOpen(false)} className="flex-1 py-3 border border-gray-100 rounded-2xl text-[13px] font-bold text-gray-400">Not yet</button>
              <button onClick={() => handleMarkComplete(selectedRequestId)} className="flex-1 py-3 bg-[#00AF91] text-white rounded-2xl text-[13px] font-bold shadow-lg shadow-green-100">Yes, Complete</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: REQUEST AGAIN --- */}
      {isRequestAgainModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={() => setIsRequestAgainModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-[340px] rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">ðŸ”„</div>
            <h3 className="text-lg font-bold">Request Again?</h3>
            <p className="text-[12px] text-gray-500 mt-2 mb-8">Are you sure you want to resend this request?</p>
            <div className="flex gap-3">
              <button onClick={() => setIsRequestAgainModalOpen(false)} className="flex-1 py-3 border border-gray-100 rounded-2xl text-[13px] font-bold text-gray-400">No, go back</button>
              <button onClick={handleRequestAgain} className="flex-1 py-3 bg-[#0B3B68] text-white rounded-2xl text-[13px] font-bold shadow-lg shadow-blue-100">Yes, Request</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: CANCEL REQUEST --- */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={() => setIsCancelModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-[360px] rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">âš ï¸</div>
            <h3 className="text-xl font-bold">Cancel this request?</h3>
            <p className="text-[12px] text-gray-500 mt-2 mb-6 text-left">This will notify the worker and remove your request from their list.</p>
            <div className="space-y-3 mb-4 text-left">
              {["Found another worker", "No longer needed", "Worker took too long to respond", "Other (state reason)"].map((reason) => (
                <label key={reason} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
                  <input type="radio" name="reason" className="accent-[#FF5252]" onChange={() => setCancelReason(reason)} />
                  <span className="text-[12px] font-medium">{reason}</span>
                </label>
              ))}
            </div>
            {cancelReason === "Other (state reason)" && (
              <textarea 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-[12px] mb-4 focus:outline-none"
                placeholder="Please state your reason..."
                onChange={(e) => setOtherReason(e.target.value)}
              />
            )}
            <div className="flex gap-3">
              <button onClick={() => setIsCancelModalOpen(false)} className="flex-1 py-3 border border-gray-100 rounded-2xl text-[13px] font-bold text-gray-400">Back</button>
              <button onClick={handleConfirmCancel} className="flex-1 py-3 bg-[#FF5252] text-white rounded-2xl text-[13px] font-bold">Confirm Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
