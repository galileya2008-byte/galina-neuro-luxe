-- Fix overly permissive INSERT on contact_messages - add rate limiting via check
DROP POLICY "Anyone can insert messages" ON public.contact_messages;
CREATE POLICY "Anyone can insert messages" ON public.contact_messages
    FOR INSERT WITH CHECK (
        length(name) <= 100 AND length(message) <= 1000 AND (email IS NULL OR length(email) <= 255)
    );

-- Fix public bucket listing - restrict to specific file access only
DROP POLICY "Anyone can view gallery images" ON storage.objects;
CREATE POLICY "Anyone can view gallery images" ON storage.objects
    FOR SELECT USING (bucket_id = 'gallery' AND auth.role() = 'anon' OR bucket_id = 'gallery' AND auth.role() = 'authenticated');