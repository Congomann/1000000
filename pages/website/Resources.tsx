
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { FileText, Video, ExternalLink, Download, Search, Youtube, Image as ImageIcon, BookOpen, Heart, Share2, MessageSquare, ThumbsDown, X, Send, PlayCircle, Minimize2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Resource } from '../../types';

export const Resources: React.FC = () => {
  const { resources, likeResource, dislikeResource, shareResource, addResourceComment, user } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  
  // State for inline video playback (In-Picture viewing)
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const filters = ['All', 'Blog', 'Video', 'YouTube', 'PDF', 'Image', 'Article', 'Link'];

  // Derive the selected resource from the live resources array so updates (likes/comments) reflect immediately
  const selectedResource = resources.find(r => r.id === selectedResourceId) || null;

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || r.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getIcon = (type: string) => {
    switch(type) {
      case 'PDF': return <FileText className="h-5 w-5 text-red-500" />;
      case 'Video': return <Video className="h-5 w-5 text-purple-500" />;
      case 'YouTube': return <Youtube className="h-5 w-5 text-red-600" />;
      case 'Article': return <ExternalLink className="h-5 w-5 text-blue-500" />;
      case 'Link': return <ExternalLink className="h-5 w-5 text-blue-500" />;
      case 'Blog': return <BookOpen className="h-5 w-5 text-green-500" />;
      case 'Image': return <ImageIcon className="h-5 w-5 text-amber-500" />;
      default: return <ExternalLink className="h-5 w-5 text-slate-500" />;
    }
  };

  const handleShare = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      shareResource(id);
      // Simulate copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (selectedResource && commentInput.trim()) {
          addResourceComment(selectedResource.id, commentInput, user?.name || 'Guest User');
          setCommentInput('');
      }
  };

  // Helper to extract YouTube ID
  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const toggleInlinePlay = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if (playingVideoId === id) {
          setPlayingVideoId(null);
      } else {
          setPlayingVideoId(id);
      }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Resources Media Hub</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
            Discover expert insights, educational videos, and comprehensive guides to master your financial future.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-12 space-y-6">
            <div className="max-w-2xl mx-auto relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search for guides, videos, articles..." 
                    className="w-full pl-14 pr-6 py-4 rounded-full border border-slate-200 shadow-xl shadow-slate-200/50 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-lg outline-none transition-all text-slate-900 bg-white"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
                {filters.map(f => (
                    <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all transform hover:scale-105 active:scale-95 ${
                            activeFilter === f 
                            ? 'bg-[#0B2240] text-white shadow-lg' 
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {filteredResources.map(resource => (
             <div 
                key={resource.id} 
                onClick={() => setSelectedResourceId(resource.id)}
                className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col group cursor-pointer overflow-hidden transform hover:-translate-y-1"
             >
                 {/* Content Header (Thumbnail or Inline Video) */}
                 <div className="relative h-48 bg-slate-100 overflow-hidden">
                     {playingVideoId === resource.id ? (
                         // Inline Player (YouTube or Direct Video)
                         <div className="w-full h-full relative bg-black" onClick={(e) => e.stopPropagation()}>
                             {resource.type === 'YouTube' ? (
                                <iframe 
                                    width="100%" 
                                    height="100%" 
                                    src={`https://www.youtube.com/embed/${getYoutubeId(resource.url)}?autoplay=1`}
                                    title="YouTube video player" 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                ></iframe>
                             ) : (
                                <video 
                                    controls 
                                    autoPlay 
                                    className="w-full h-full object-contain" 
                                    src={resource.url} 
                                />
                             )}
                            <button 
                                onClick={(e) => toggleInlinePlay(e, resource.id)}
                                className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-red-600 transition-colors z-20"
                                title="Close Video"
                            >
                                <Minimize2 className="h-4 w-4" />
                            </button>
                         </div>
                     ) : (
                         // Standard Thumbnail View
                         <>
                             {resource.thumbnail ? (
                                 <img src={resource.thumbnail} alt={resource.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                             ) : resource.type === 'YouTube' ? (
                                 <img src={`https://img.youtube.com/vi/${getYoutubeId(resource.url)}/hqdefault.jpg`} alt={resource.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                             ) : resource.type === 'Video' ? (
                                 // Direct Video Preview (No Thumbnail provided)
                                 <video 
                                    className="w-full h-full object-cover" 
                                    src={resource.url}
                                    muted
                                    onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                                    onMouseOut={(e) => { (e.target as HTMLVideoElement).pause(); (e.target as HTMLVideoElement).currentTime = 0; }} 
                                 />
                             ) : (
                                 <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200">
                                     {getIcon(resource.type)}
                                 </div>
                             )}
                             
                             {/* Overlay for Video Types to Play Inline */}
                             {(resource.type === 'YouTube' || resource.type === 'Video') && (
                                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                     <button 
                                        onClick={(e) => toggleInlinePlay(e, resource.id)}
                                        className="bg-red-600 text-white p-3 rounded-full opacity-80 group-hover:opacity-100 transition-all pointer-events-auto hover:scale-110 shadow-lg"
                                     >
                                         <PlayCircle className="h-8 w-8 fill-white text-red-600" />
                                     </button>
                                 </div>
                             )}

                             <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-2">
                                <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-slate-800 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm w-fit">
                                    {getIcon(resource.type)} {resource.type}
                                </span>
                                {resource.url?.startsWith('blob:') && (
                                    <span className="px-3 py-1 bg-amber-100/90 backdrop-blur-md text-amber-800 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm w-fit">
                                        <AlertCircle className="h-3 w-3" /> Session Only
                                    </span>
                                )}
                             </div>
                         </>
                     )}
                 </div>
                 
                 <div className="p-6 flex flex-col flex-1">
                     <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                         {resource.title}
                     </h3>
                     <p className="text-slate-500 mb-6 text-sm leading-relaxed line-clamp-3 flex-1">
                         {resource.description || 'No description available.'}
                     </p>
                     
                     <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-slate-400 text-xs font-bold">
                        <span>{new Date(resource.dateAdded).toLocaleDateString()}</span>
                        <div className="flex gap-4">
                            <span className="flex items-center gap-1 hover:text-red-500 transition-colors" onClick={(e) => { e.stopPropagation(); likeResource(resource.id); }}>
                                <Heart className={`h-4 w-4 ${resource.likes > 0 ? 'fill-red-500 text-red-500' : ''}`} /> {resource.likes}
                            </span>
                            <span className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                                <MessageSquare className="h-4 w-4" /> {resource.comments.length}
                            </span>
                        </div>
                     </div>
                 </div>
             </div>
           ))}
        </div>
        
        {filteredResources.length === 0 && (
           <div className="col-span-full text-center py-20 text-slate-400">
               <p className="text-lg font-medium">No resources found matching your criteria.</p>
               <button onClick={() => { setSearchTerm(''); setActiveFilter('All'); }} className="mt-4 text-blue-600 font-bold hover:underline">Clear Filters</button>
           </div>
       )}
      </div>

      {/* Detail Modal */}
      {selectedResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-fade-in">
              {/* Backdrop Click Handler to Close */}
              <div className="absolute inset-0 z-0" onClick={() => setSelectedResourceId(null)}></div>
              
              <div className="bg-white rounded-[2.5rem] w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl relative animate-slide-up z-10">
                  {/* Modal Header */}
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                      <div className="flex items-center gap-3">
                          <span className="p-2 bg-slate-100 rounded-xl">{getIcon(selectedResource.type)}</span>
                          <h2 className="text-xl font-bold text-slate-900 truncate max-w-md">{selectedResource.title}</h2>
                      </div>
                      <button onClick={() => setSelectedResourceId(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                          <X className="h-6 w-6 text-slate-400" />
                      </button>
                  </div>

                  {/* Modal Content Scrollable */}
                  <div className="flex-1 overflow-y-auto">
                      <div className="grid grid-cols-1 lg:grid-cols-3 min-h-full">
                          {/* Main Content Area */}
                          <div className="lg:col-span-2 p-8 border-r border-slate-100">
                              {selectedResource.type === 'YouTube' && getYoutubeId(selectedResource.url) ? (
                                  <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg mb-6 bg-black">
                                      <iframe 
                                          width="100%" 
                                          height="100%" 
                                          src={`https://www.youtube.com/embed/${getYoutubeId(selectedResource.url)}?autoplay=1`}
                                          title="YouTube video player" 
                                          frameBorder="0" 
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                          allowFullScreen
                                      ></iframe>
                                  </div>
                              ) : selectedResource.type === 'Video' ? (
                                  <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg mb-6 bg-black">
                                      <video controls className="w-full h-full" poster={selectedResource.thumbnail}>
                                          <source src={selectedResource.url} />
                                          Your browser does not support the video tag.
                                      </video>
                                  </div>
                              ) : selectedResource.type === 'Image' ? (
                                  <div className="rounded-2xl overflow-hidden shadow-lg mb-6">
                                      <img src={selectedResource.url} alt={selectedResource.title} className="w-full h-auto" />
                                  </div>
                              ) : null}

                              {/* Blog Content */}
                              <div className="prose prose-slate max-w-none">
                                  {selectedResource.content ? (
                                      <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-lg">
                                          {selectedResource.content}
                                      </div>
                                  ) : (
                                      <p className="text-slate-600 text-lg leading-relaxed">{selectedResource.description}</p>
                                  )}
                              </div>

                              {/* External Link / PDF Button */}
                              {['PDF', 'Link', 'Article'].includes(selectedResource.type) && (
                                  <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                          <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                                              {selectedResource.type === 'PDF' ? <FileText className="h-6 w-6 text-red-500"/> : <ExternalLink className="h-6 w-6 text-blue-500"/>}
                                          </div>
                                          <div>
                                              <p className="font-bold text-slate-900">External Resource</p>
                                              <p className="text-xs text-slate-500">Opens in new tab</p>
                                          </div>
                                      </div>
                                      <a 
                                          href={selectedResource.url} 
                                          target="_blank" 
                                          rel="noreferrer"
                                          download={['PDF', 'Image'].includes(selectedResource.type) ? selectedResource.title : undefined}
                                          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                                      >
                                          {selectedResource.type === 'PDF' ? 'Download PDF' : 'Visit Link'}
                                      </a>
                                  </div>
                              )}
                          </div>

                          {/* Interaction Sidebar */}
                          <div className="bg-slate-50 p-8 flex flex-col h-full">
                              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
                                  <div className="flex gap-4">
                                      <button onClick={() => likeResource(selectedResource.id)} className="flex flex-col items-center gap-1 group">
                                          <div className={`p-3 rounded-full transition-colors ${selectedResource.likes > 0 ? 'bg-red-100' : 'bg-white hover:bg-red-50'}`}>
                                              <Heart className={`h-5 w-5 ${selectedResource.likes > 0 ? 'fill-red-500 text-red-500' : 'text-slate-400 group-hover:text-red-500'}`} />
                                          </div>
                                          <span className="text-xs font-bold text-slate-500">{selectedResource.likes}</span>
                                      </button>
                                      <button onClick={() => dislikeResource(selectedResource.id)} className="flex flex-col items-center gap-1 group">
                                          <div className={`p-3 rounded-full transition-colors ${selectedResource.dislikes > 0 ? 'bg-slate-200' : 'bg-white hover:bg-slate-200'}`}>
                                              <ThumbsDown className={`h-5 w-5 ${selectedResource.dislikes > 0 ? 'fill-slate-500 text-slate-500' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                          </div>
                                          <span className="text-xs font-bold text-slate-500">{selectedResource.dislikes}</span>
                                      </button>
                                      <button onClick={(e) => handleShare(selectedResource.id, e)} className="flex flex-col items-center gap-1 group">
                                          <div className="p-3 bg-white rounded-full hover:bg-blue-50 transition-colors">
                                              <Share2 className="h-5 w-5 text-slate-400 group-hover:text-blue-500" />
                                          </div>
                                          <span className="text-xs font-bold text-slate-500">Share</span>
                                      </button>
                                  </div>
                              </div>

                              <h3 className="font-bold text-slate-900 mb-4">Comments ({selectedResource.comments.length})</h3>
                              
                              <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
                                  {selectedResource.comments.length === 0 && (
                                      <p className="text-sm text-slate-400 italic text-center py-4">No comments yet. Be the first!</p>
                                  )}
                                  {selectedResource.comments.map(comment => (
                                      <div key={comment.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                          <div className="flex justify-between items-start mb-2">
                                              <span className="font-bold text-xs text-slate-900">{comment.user}</span>
                                              <span className="text-[10px] text-slate-400">{new Date(comment.date).toLocaleDateString()}</span>
                                          </div>
                                          <p className="text-sm text-slate-600 leading-relaxed">{comment.text}</p>
                                      </div>
                                  ))}
                              </div>

                              <form onSubmit={handleCommentSubmit} className="relative">
                                  <input 
                                      type="text" 
                                      placeholder="Add a comment..." 
                                      className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                      value={commentInput}
                                      onChange={e => setCommentInput(e.target.value)}
                                  />
                                  <button 
                                      type="submit" 
                                      disabled={!commentInput.trim()}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                      <Send className="h-3 w-3" />
                                  </button>
                              </form>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
