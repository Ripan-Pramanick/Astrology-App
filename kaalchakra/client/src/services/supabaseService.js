// client/src/services/supabaseService.js
import { supabase } from '../lib/supabase';

export const supabaseService = {
  // Services ফেচ করা
  getServices: async (language = 'en', limit = 9) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(limit);
      
      if (error) throw error;
      
      // ভাষা অনুযায়ী ডাটা ফরম্যাট করা
      const formattedServices = data.map(service => ({
        id: service.id,
        name: service[`name_${language}`] || service.name_en,
        subtitle: service[`subtitle_${language}`] || service.subtitle_en,
        original_price: service.original_price,
        price: service.price,
        icon_svg: service.icon_svg,
        icon_type: service.icon_type,
        display_order: service.display_order
      }));
      
      return {
        success: true,
        services: formattedServices
      };
    } catch (error) {
      console.error('Error fetching services:', error);
      return {
        success: false,
        error: error.message,
        services: []
      };
    }
  },
  
  // Banner ফেচ করা
  getServicesBanner: async (language = 'en') => {
    try {
      const { data, error } = await supabase
        .from('services_banner')
        .select('*')
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      
      return {
        success: true,
        data: {
          title: data[`title_${language}`] || data.title_en,
          price: data.price,
          link: data.link
        }
      };
    } catch (error) {
      console.error('Error fetching banner:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  // অর্ডার তৈরি করা
  createOrder: async (orderData) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          service_id: orderData.serviceId,
          user_id: orderData.userId,
          user_name: orderData.userName,
          user_phone: orderData.userPhone,
          service_name: orderData.serviceName,
          price: orderData.price,
          language: orderData.language,
          status: 'pending',
          created_at: new Date()
        }])
        .select();
      
      if (error) throw error;
      
      return {
        success: true,
        order: data[0]
      };
    } catch (error) {
      console.error('Error creating order:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

getBlogPosts: async (language = 'en', limit = 9, offset = 0, category = null) => {
  try {
    let query = supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    const formattedPosts = data.map(post => ({
      id: post.id,
      title: post[`title_${language}`] || post.title_en,
      excerpt: post[`excerpt_${language}`] || post.excerpt_en,
      content: post[`content_${language}`] || post.content_en,
      slug: post.slug,
      category: post.category,
      author: post.author,
      author_name: post.author_name,
      image_url: post.image_url,
      read_time: post.read_time,
      is_featured: post.is_featured,
      is_trending: post.is_trending,
      published_at: post.published_at,
      created_at: post.created_at
    }));
    
    return { success: true, posts: formattedPosts };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return { success: false, error: error.message, posts: [] };
  }
}