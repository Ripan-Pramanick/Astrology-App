// client/src/services/heroService.js
import { supabase } from '../lib/supabase';

export const heroService = {
  // হিরো ডাটা পাওয়ার জন্য
  getHeroData: async (language = 'en') => {
    try {
      const { data, error } = await supabase
        .from('hero_content')
        .select('*')
        .eq('language', language)
        .single();
      
      if (error) throw error;
      
      return {
        success: true,
        data: {
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
          buttonText: data.button_text,
          buttonLink: data.button_link,
          secondaryButtonText: data.secondary_button_text,
          secondaryButtonLink: data.secondary_button_link
        }
      };
    } catch (error) {
      console.error('Error fetching hero data:', error);
      // লোকাল i18n ফাইল থেকে ফলব্যাক ডাটা ব্যবহার করুন
      return {
        success: false,
        error: error.message
      };
    }
  },

  // স্ট্যাটস পাওয়ার জন্য
  getHeroStats: async (language = 'en') => {
    try {
      const { data, error } = await supabase
        .from('hero_stats')
        .select('*')
        .eq('language', language)
        .single();
      
      if (error) throw error;
      
      return {
        success: true,
        stats: {
          happyClients: data.happy_clients,
          yearsOfService: data.years_of_service,
          certifiedAstrologers: data.certified_astrologers,
          support: data.support
        }
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};