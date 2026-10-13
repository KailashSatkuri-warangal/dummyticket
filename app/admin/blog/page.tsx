import React from 'react';
import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/flights/dataset';

export default function AdminBlogPage() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-navy-900">
          Editorial Blog CMS ({BLOG_POSTS.length} Published Articles)
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Manage SEO articles, meta titles, structured headings, and FAQ blocks.
        </p>
      </div>

      <div className="divide-y divide-slate-100 text-xs">
        {BLOG_POSTS.map((post) => (
          <div
            key={post.id}
            className="py-4 flex flex-wrap items-center justify-between gap-4"
          >
            <div>
              <span className="rounded bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700">
                {post.category}
              </span>
              <p className="mt-1 text-sm font-bold text-navy-900">
                {post.title}
              </p>
              <p className="text-slate-500">
                Slug: <code>/blog/{post.slug}</code> · Updated: {post.updatedAt.slice(0, 10)}
              </p>
            </div>
            <Link
              href={`/blog/${post.slug}`}
              className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-brand-600 hover:bg-slate-50"
            >
              Preview Live Page →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
