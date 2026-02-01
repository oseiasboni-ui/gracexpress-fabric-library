// ==========================================
// CLOUDINARY SERVICE
// Handles image uploads to Cloudinary
// Syncs images between gracexpress.com and gracexpress.com.br
// ==========================================

const CloudinaryService = {
    // Cloudinary Configuration
    cloudName: 'dgsylqkgn',
    uploadPreset: 'dgsylqkgn',

    // Two folders - one for each site
    folders: {
        com: 'gracexpress-com',
        comBr: 'gracexpress-com-br'
    },

    // Detect which site we're on
    getCurrentFolder() {
        const hostname = window.location.hostname;
        if (hostname.includes('.com.br')) {
            return this.folders.comBr;
        }
        // Default to .com folder (also for localhost/development)
        return this.folders.com;
    },

    /**
     * Get the direct URL for a fabric image by its ID from a specific folder
     * @param {string} fabricId - The fabric ID
     * @param {string} folder - The folder to get from
     * @returns {string} - The Cloudinary URL
     */
    getImageUrlFromFolder(fabricId, folder) {
        return `https://res.cloudinary.com/${this.cloudName}/image/upload/${folder}/${fabricId}`;
    },

    /**
     * Get image URL - tries current site's folder first, then the other
     * This enables sync between sites
     * @param {string} fabricId - The fabric ID
     * @returns {string} - The Cloudinary URL (from current site's folder)
     */
    getImageUrl(fabricId) {
        const currentFolder = this.getCurrentFolder();
        return this.getImageUrlFromFolder(fabricId, currentFolder);
    },

    /**
     * Check if an image exists in a specific folder
     * @param {string} fabricId - The fabric ID
     * @param {string} folder - The folder to check
     * @returns {Promise<boolean>} - True if image exists
     */
    async checkImageExistsInFolder(fabricId, folder) {
        try {
            const url = this.getImageUrlFromFolder(fabricId, folder);
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    },

    /**
     * Check if an image exists in EITHER folder
     * Returns the URL if found, null otherwise
     * @param {string} fabricId - The fabric ID
     * @returns {Promise<string|null>} - The URL if found, null otherwise
     */
    async findImageUrl(fabricId) {
        // Try current site's folder first
        const currentFolder = this.getCurrentFolder();
        const otherFolder = currentFolder === this.folders.com ? this.folders.comBr : this.folders.com;

        // Check current folder first
        const existsInCurrent = await this.checkImageExistsInFolder(fabricId, currentFolder);
        if (existsInCurrent) {
            return this.getImageUrlFromFolder(fabricId, currentFolder);
        }

        // Check other folder
        const existsInOther = await this.checkImageExistsInFolder(fabricId, otherFolder);
        if (existsInOther) {
            return this.getImageUrlFromFolder(fabricId, otherFolder);
        }

        return null;
    },

    /**
     * Upload an image to Cloudinary with fabric ID as filename
     * @param {Blob|File} file - The image file or blob to upload
     * @param {string} fabricId - The fabric ID to use as filename
     * @returns {Promise<{url: string, publicId: string}>} - The secure URL and public ID
     */
    async uploadImage(file, fabricId) {
        const folder = this.getCurrentFolder();

        console.log('🚀 Starting Cloudinary upload...');
        console.log('📦 Cloud Name:', this.cloudName);
        console.log('📁 Folder:', folder);
        console.log('🆔 Fabric ID:', fabricId);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', this.uploadPreset);
        formData.append('folder', folder);
        // Use fabric ID as the public_id so we can find it later
        formData.append('public_id', fabricId);

        const uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

        try {
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('❌ Upload failed:', data.error?.message || 'Unknown error');
                throw new Error(data.error?.message || 'Upload failed');
            }

            console.log('✅ Upload successful!');
            console.log('🔗 Secure URL:', data.secure_url);

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
     * @param {string} fabricId - The fabric ID
     * @returns {Promise<{url: string, publicId: string}>}
     */
    async uploadBase64Image(dataUrl, fabricId) {
        const blob = this.dataUrlToBlob(dataUrl);
        return this.uploadImage(blob, fabricId);
    }
};

// Export for global access
window.CloudinaryService = CloudinaryService;
