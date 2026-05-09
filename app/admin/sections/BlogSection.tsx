// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";

// interface Blog {
//   _id?: string;
//   title: string;
//   excerpt: string;
//   content: string;
//   publishedAt: Date;
//   author: string;
//   tags: string[];
//   slug: string;
//   readTime: number;
//   thumbnailUrl: string;
// }

// export default function AdminBlogsPage() {
//   const [blogs, setBlogs] = useState<Blog[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
//   const [newBlog, setNewBlog] = useState({
//     title: "",
//     excerpt: "",
//     content: "",
//     author: "",
//     tags: "",
//     slug: "",
//     readTime: 5,
//     thumbnailUrl: "",
//   });

//   const adminToken =
//     typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

//   useEffect(() => {
//     fetchBlogs();
//   }, []);

//   const fetchBlogs = async () => {
//     try {
//       const res = await axios.get("/api/blogposts/", {
//         headers: { Authorization: `Bearer ${adminToken}` },
//       });
//       setBlogs(res.data);
//       setLoading(false);
//     } catch (err) {
//       console.error(err);
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     if (editingBlog) {
//       setEditingBlog({ ...editingBlog, [e.target.name]: e.target.value });
//     } else {
//       setNewBlog({ ...newBlog, [e.target.name]: e.target.value });
//     }
//   };

//   const handleCreateBlog = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(
//         "/api/blogposts/",
//         {
//           ...newBlog,
//           tags: newBlog.tags.split(",").map((tag) => tag.trim()),
//         },
//         { headers: { Authorization: `Bearer ${adminToken}` } }
//       );
//       toast.success("Blog created successfully!");
//       setNewBlog({
//         title: "",
//         excerpt: "",
//         content: "",
//         author: "",
//         tags: "",
//         slug: "",
//         readTime: 5,
//         thumbnailUrl: "",
//       });
//       fetchBlogs();
//     } catch (err: any) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Failed to create blog.");
//     }
//   };

//   const handleUpdateBlog = async (slug: string) => {
//     if (!editingBlog) return;
//     try {
//       const { _id, slug: _, publishedAt, ...updateData } = editingBlog as any;
      
//       await axios.patch(
//         `/api/blogposts/${slug}`,
//         { ...updateData, tags: editingBlog.tags.map((t) => t.trim()) },
//         { headers: { Authorization: `Bearer ${adminToken}` } }
//       );
//       toast.success("Blog updated successfully!");
//       setEditingBlog(null);
//       fetchBlogs();
//     } catch (err: any) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Failed to update blog.");
//     }
//   };

//   const handleDeleteBlog = async (slug: string) => {
//     if (!confirm("Are you sure you want to delete this blog?")) return;
//     try {
//       await axios.delete(`/api/blogposts/${slug}`, {
//         headers: { Authorization: `Bearer ${adminToken}` },
//       });
//       toast.success("Blog deleted!");
//       fetchBlogs();
//     } catch (err: any) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Failed to delete blog.");
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold mb-4">Admin Blogs</h1>

//       <form
//         onSubmit={editingBlog ? (e) => { e.preventDefault(); handleUpdateBlog(editingBlog.slug); } : handleCreateBlog}
//         className="p-4 bg-white shadow rounded space-y-4"
//       >
//         <h2 className="font-semibold text-lg">
//           {editingBlog ? "Edit Blog" : "Create New Blog"}
//         </h2>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input
//             type="text"
//             name="title"
//             placeholder="Title"
//             value={editingBlog ? editingBlog.title : newBlog.title}
//             onChange={handleInputChange}
//             required
//             className="w-full border p-2 rounded"
//           />
//           <input
//             type="text"
//             name="author"
//             placeholder="Author"
//             value={editingBlog ? editingBlog.author : newBlog.author}
//             onChange={handleInputChange}
//             required
//             className="w-full border p-2 rounded"
//           />
//           <input
//             type="text"
//             name="excerpt"
//             placeholder="Excerpt"
//             value={editingBlog ? editingBlog.excerpt : newBlog.excerpt}
//             onChange={handleInputChange}
//             required
//             className="w-full border p-2 rounded"
//           />
//           <input
//             type="text"
//             name="slug"
//             placeholder="Slug"
//             value={editingBlog ? editingBlog.slug : newBlog.slug}
//             onChange={handleInputChange}
//             required
//             className="w-full border p-2 rounded"
//             disabled={!!editingBlog}
//           />
//           <input
//             type="text"
//             name="tags"
//             placeholder="Tags (comma separated)"
//             value={editingBlog ? editingBlog.tags.join(",") : newBlog.tags}
//             onChange={handleInputChange}
//             className="w-full border p-2 rounded"
//           />
//           <input
//             type="number"
//             name="readTime"
//             placeholder="Read Time (minutes)"
//             value={editingBlog ? editingBlog.readTime : newBlog.readTime}
//             onChange={handleInputChange}
//             className="w-full border p-2 rounded"
//           />
//           <input
//             type="text"
//             name="thumbnailUrl"
//             placeholder="Thumbnail URL"
//             value={editingBlog ? editingBlog.thumbnailUrl : newBlog.thumbnailUrl}
//             onChange={handleInputChange}
//             className="w-full border p-2 rounded md:col-span-2"
//           />
//         </div>
        
//         <textarea
//           name="content"
//           placeholder="Content"
//           value={editingBlog ? editingBlog.content : newBlog.content}
//           onChange={handleInputChange}
//           required
//           className="w-full border p-2 rounded"
//           rows={5}
//         />
        
//         <div>
//           <button
//             type="submit"
//             className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
//           >
//             {editingBlog ? "Update Blog" : "Create Blog"}
//           </button>
//           {editingBlog && (
//             <button
//               type="button"
//               className="ml-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
//               onClick={() => setEditingBlog(null)}
//             >
//               Cancel
//             </button>
//           )}
//         </div>
//       </form>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {loading ? (
//           <p>Loading blogs...</p>
//         ) : (
//           blogs.map((blog) => (
//             <div key={blog.slug} className="bg-white shadow rounded overflow-hidden flex flex-col">
//               <img src={blog.thumbnailUrl} alt={blog.title} className="h-40 w-full object-cover" />
//               <div className="p-4 flex-1 flex flex-col justify-between">
//                 <div>
//                   <h3 className="font-bold text-lg">Title: {blog.title}</h3>
//                   <p className="text-sm text-gray-500">Excerpt: {blog.excerpt}</p>
//                   <p className="text-xs text-gray-400 mt-1">Author: {blog.author}</p>
//                 </div>
//                 <div className="mt-4 flex justify-between items-center">
//                   <button
//                     className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600 text-black text-sm"
//                     onClick={() => setEditingBlog(blog)}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-white text-sm"
//                     onClick={() => handleDeleteBlog(blog.slug)}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }