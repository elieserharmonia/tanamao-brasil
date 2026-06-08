import { supabase } from './supabase';

export const storageService = {
  /**
   * Upload file to a specific bucket
   */
  async uploadFile(bucket: 'avatars' | 'portfolios' | 'documents', userId: string, file: File) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return { publicUrl, filePath: data.path };
    } catch (error) {
      console.error(`Error uploading to ${bucket}:`, error);
      throw error;
    }
  },

  /**
   * Delete file from a specific bucket
   */
  async deleteFile(bucket: 'avatars' | 'portfolios' | 'documents', filePath: string) {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting from ${bucket}:`, error);
      throw error;
    }
  },

  /**
   * Validate file size and type
   */
  validateFile(file: File, allowedTypes: string[], maxSizeMB: number = 5) {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Tipo de arquivo não permitido. Use: ${allowedTypes.join(', ')}`);
    }

    if (file.size > maxSizeBytes) {
      throw new Error(`Arquivo muito grande. Limite máximo: ${maxSizeMB}MB`);
    }

    return true;
  }
};
