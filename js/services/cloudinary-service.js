// ==========================================
// CLOUDINARY SERVICE
// Handles image uploads to Cloudinary
// ==========================================

const CloudinaryService = {
    // Cloudinary Configuration
    cloudName: 'dgsylqkgn',
    uploadPreset: 'dgsylqkgn',

    /**
     * Upload an image to Cloudinary
     * @param {Blob|File} file - The image file or blob to upload
     * @param {string} folder - Optional folder name in Cloudinary
     * @returns {Promise<{url: string, publicId: string}>} - The secure URL and public ID
     */
    async uploadImage(file, folder = 'gracexpress-fabrics') {
        console.log('🚀 Starting Cloudinary upload...');
        console.log('📦 Cloud Name:', this.cloudName);
        console.log('📝 Upload Preset:', this.uploadPreset);
        console.log('📁 Folder:', folder);
        console.log('📄 File size:', file.size, 'bytes');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', this.uploadPreset);
        formData.append('folder', folder);

        const uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
        console.log('🌐 Upload URL:', uploadUrl);

        try {
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData
            });

            console.log('📡 Response status:', response.status);
            console.log('📡 Response OK:', response.ok);

            const data = await response.json();
            console.log('📥 Cloudinary response:', JSON.stringify(data, null, 2));

            if (!response.ok) {
                console.error('❌ Upload failed:', data.error?.message || 'Unknown error');
                throw new Error(data.error?.message || 'Upload failed');
            }

            console.log('✅ Upload successful!');
            console.log('🔗 Secure URL:', data.secure_url);
            console.log('🆔 Public ID:', data.public_id);

            return {
                url: data.secure_url,
                publicId: data.public_id
            };
        } catch (error) {
            console.error('❌ Cloudinary upload error:', error);
            throw error;
        }
    },

    /**
     * Convert a base64 data URL to a Blob
     * @param {string} dataUrl - The base64 data URL
     * @returns {Blob} - The converted blob
     */
    dataUrlToBlob(dataUrl) {
        const arr = dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    },

    /**
     * Upload a base64 image to Cloudinary
     * @param {string} dataUrl - The base64 data URL
     * @param {string} folder - Optional folder name
     * @returns {Promise<{url: string, publicId: string}>}
     */
    async uploadBase64Image(dataUrl, folder = 'gracexpress-fabrics') {
        const blob = this.dataUrlToBlob(dataUrl);
        return this.uploadImage(blob, folder);
    }
};

// Export for global access
window.CloudinaryService = CloudinaryService;

