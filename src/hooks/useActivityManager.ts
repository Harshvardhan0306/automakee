
import { useState, useEffect } from "react";
import { ContactSubmission, BlogPost, Review } from "@/context/AdminContext";

export function useActivityManager(
  contacts: ContactSubmission[],
  blogs: BlogPost[],
  reviews: Review[]
) {
  const [recentActivities, setRecentActivities] = useState<Array<{ text: string; time: string }>>([]);

  useEffect(() => {
    generateRecentActivities();
  }, [contacts, blogs, reviews]);

  const generateRecentActivities = () => {
    const activities: Array<{ text: string; time: string }> = [];
    
    contacts.slice(0, 2).forEach(contact => {
      activities.push({
        text: `New contact form submission from ${contact.name}`,
        time: getTimeAgo(new Date(contact.created_at))
      });
    });
    
    blogs.slice(0, 2).forEach(blog => {
      activities.push({
        text: `Blog post '${blog.title}' ${blog.status === 'approved' ? 'published' : 'submitted for review'}`,
        time: getTimeAgo(blog.date)
      });
    });
    
    reviews.slice(0, 2).forEach(review => {
      activities.push({
        text: `${review.status === 'approved' ? 'Approved' : 'New'} review from ${review.name}`,
        time: getTimeAgo(new Date(review.created_at))
      });
    });
    
    activities.sort((a, b) => {
      const timeA = parseTimeAgo(a.time);
      const timeB = parseTimeAgo(b.time);
      return timeA - timeB;
    });
    
    setRecentActivities(activities.slice(0, 5));
  };
  
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  const parseTimeAgo = (timeAgo: string) => {
    if (timeAgo === "Just now") {
      return 0;
    } else if (timeAgo.includes("minute")) {
      const minutes = parseInt(timeAgo);
      return minutes * 60 * 1000;
    } else if (timeAgo.includes("hour")) {
      const hours = parseInt(timeAgo);
      return hours * 60 * 60 * 1000;
    } else if (timeAgo.includes("day")) {
      const days = parseInt(timeAgo);
      return days * 24 * 60 * 60 * 1000;
    } else {
      return 7 * 24 * 60 * 60 * 1000;
    }
  };

  return {
    recentActivities,
    getTimeAgo
  };
}
