// client/src/services/supabaseService.js
import { supabase } from '../lib/supabase';

export const supabaseService = {
  // ==================== SERVICES ====================
  getServices: async (language = 'en', limit = 9) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(limit);
      
      if (error) throw error;
      
      const formattedServices = data.map(service => ({
        id: service.id,
        name: service[`name_${language}`] || service.name_en,
        subtitle: service[`subtitle_${language}`] || service.subtitle_en,
        original_price: service.original_price,
        price: service.price,
        icon_svg: service.icon_svg,
        icon_type: service.icon_type
      }));
      
      return { success: true, services: formattedServices };
    } catch (error) {
      console.error('Error fetching services:', error);
      return { success: false, error: error.message, services: [] };
    }
  },

  // ==================== BANNER ====================
  getBanner: async (language = 'en') => {
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
      return { success: false, error: error.message };
    }
  },

  // ==================== LAGNA CHARACTERISTICS ====================
  getLagnaCharacteristics: async (lagnaName) => {
    if (!lagnaName) return { success: false, data: null };
    
    try {
      const { data, error } = await supabase
        .from('lagna_characteristics')
        .select('*')
        .eq('lagna_name', lagnaName)
        .single();
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching lagna data:', error);
      return { success: false, error: error.message, data: null };
    }
  },

  // ==================== SADE SATI ====================
  getCurrentSaturnPosition: async () => {
    try {
      const { data, error } = await supabase
        .from('current_sade_sati')
        .select('*')
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching Saturn position:', error);
      return { success: false, error: error.message };
    }
  },

  getSadeSatiByMoonSign: async (moonSign, phase = null) => {
    if (!moonSign) return { success: false, data: null };
    
    try {
      let query = supabase
        .from('sade_sati')
        .select('*')
        .eq('moon_sign', moonSign);
      
      if (phase) {
        query = query.eq('phase', phase);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching Sade Sati:', error);
      return { success: false, error: error.message, data: null };
    }
  },

  // ==================== COMPATIBILITY ====================
  getCompatibilityScores: async (sign) => {
    if (!sign) return { success: false, data: [] };
    
    try {
      const { data, error } = await supabase
        .from('compatibility_scores')
        .select('*')
        .or(`sign1.eq.${sign},sign2.eq.${sign}`)
        .order('score', { ascending: false });
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching compatibility:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  getPartnerCompatibility: async (sign1, sign2) => {
    if (!sign1 || !sign2) return { success: false, data: null };
    
    try {
      const { data, error } = await supabase
        .from('compatibility_scores')
        .select('*')
        .or(`and(sign1.eq.${sign1},sign2.eq.${sign2}),and(sign1.eq.${sign2},sign2.eq.${sign1})`)
        .single();
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching partner compatibility:', error);
      return { success: false, error: error.message, data: null };
    }
  },

  // ==================== DARAKARAKA ====================
  getDarakarakaByPlanet: async (planetName) => {
    if (!planetName) return { success: false, data: null };
    
    try {
      const { data, error } = await supabase
        .from('darakaraka_planets')
        .select('*')
        .eq('planet', planetName)
        .single();
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching Darakaraka:', error);
      return { success: false, error: error.message, data: null };
    }
  },

  // ==================== DRISHTI ====================
  getPlanetDrishti: async (planet, baseSign) => {
    if (!planet || !baseSign) return { success: false, data: null };
    
    try {
      const { data, error } = await supabase
        .from('planet_drishti')
        .select('*')
        .eq('planet', planet)
        .eq('base_sign', baseSign)
        .single();
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error(`Error fetching ${planet} drishti:`, error);
      return { success: false, error: error.message, data: null };
    }
  },

  getPlanetOtherEffects: async (planetFrom, planetTo) => {
    try {
      const { data, error } = await supabase
        .from('planet_other_effects')
        .select('*')
        .eq('planet_aspect', `${planetFrom} → ${planetTo}`)
        .single();
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching planet aspect:', error);
      return { success: false, error: error.message, data: null };
    }
  },

  // ==================== REMEDIES ====================
  getRemedies: async (type = null, language = 'bn') => {
    try {
      let query = supabase
        .from('remedies')
        .select('*')
        .eq('language', language);
      
      if (type) {
        query = query.eq('type', type);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching remedies:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  // ==================== CONCEPTS ====================
  getConcepts: async (type = null, language = 'bn') => {
    try {
      let query = supabase
        .from('concepts')
        .select('*')
        .eq('language', language);
      
      if (type) {
        query = query.eq('type', type);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching concepts:', error);
      return { success: false, error: error.message, data: [] };
    }
  }
};

export default supabaseService;