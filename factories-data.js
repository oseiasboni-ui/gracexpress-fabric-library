// 100 Major Textile Factories Worldwide
const textileFactories = [
    // China (20)
    { id: 1, name: "Shenzhou International", country: "China", specialty: "Sportswear & Knits", employees: 90000, certifications: ["ISO 14001", "OEKO-TEX"] },
    { id: 2, name: "Texhong Textile Group", country: "China", specialty: "Denim & Cotton", employees: 50000, certifications: ["GOTS", "BCI"] },
    { id: 3, name: "Jiangsu Sunshine Group", country: "China", specialty: "Wool & Worsted", employees: 30000, certifications: ["ISO 9001"] },
    { id: 4, name: "Luthai Textile", country: "China", specialty: "Shirting & Cotton", employees: 25000, certifications: ["OEKO-TEX", "GOTS"] },
    { id: 5, name: "Weiqiao Textile", country: "China", specialty: "Cotton & Blends", employees: 60000, certifications: ["ISO 14001"] },
    { id: 6, name: "Huafu Fashion", country: "China", specialty: "Yarn & Color Spinning", employees: 20000, certifications: ["BCI", "OEKO-TEX"] },
    { id: 7, name: "Youngor Group", country: "China", specialty: "Suits & Formal Wear", employees: 45000, certifications: ["ISO 9001"] },
    { id: 8, name: "Sinosilk", country: "China", specialty: "Silk & Silk Blends", employees: 8000, certifications: ["GOTS", "OEKO-TEX"] },
    { id: 9, name: "Jiangsu Lianfa Textile", country: "China", specialty: "Technical Textiles", employees: 15000, certifications: ["ISO 14001"] },
    { id: 10, name: "Zhejiang Tiansheng Holding", country: "China", specialty: "Wool Fabrics", employees: 12000, certifications: ["ISO 9001"] },

    // Japan (8)
    { id: 11, name: "Toray Industries", country: "Japan", specialty: "Synthetic Fibers & Carbon", employees: 48000, certifications: ["ISO 14001", "OEKO-TEX"] },
    { id: 12, name: "Teijin Limited", country: "Japan", specialty: "Advanced Fibers", employees: 20000, certifications: ["ISO 14001"] },
    { id: 13, name: "Asahi Kasei", country: "Japan", specialty: "Cupro & Spandex", employees: 35000, certifications: ["OEKO-TEX"] },
    { id: 14, name: "Kuraray", country: "Japan", specialty: "Specialty Fibers", employees: 11000, certifications: ["ISO 9001"] },
    { id: 15, name: "Unitika", country: "Japan", specialty: "Nylon & Technical", employees: 3500, certifications: ["ISO 14001"] },
    { id: 16, name: "Toyobo", country: "Japan", specialty: "Films & Fibers", employees: 10000, certifications: ["ISO 14001"] },
    { id: 17, name: "Nisshinbo Holdings", country: "Japan", specialty: "Cotton & Denim", employees: 22000, certifications: ["OEKO-TEX"] },
    { id: 18, name: "Seiren Co.", country: "Japan", specialty: "Dyeing & Finishing", employees: 5000, certifications: ["ISO 9001"] },

    // India (12)
    { id: 19, name: "Arvind Limited", country: "India", specialty: "Denim & Shirting", employees: 35000, certifications: ["GOTS", "BCI", "OEKO-TEX"] },
    { id: 20, name: "Raymond Limited", country: "India", specialty: "Wool & Suits", employees: 25000, certifications: ["OEKO-TEX"] },
    { id: 21, name: "Welspun India", country: "India", specialty: "Home Textiles", employees: 28000, certifications: ["GOTS", "OEKO-TEX"] },
    { id: 22, name: "Vardhman Textiles", country: "India", specialty: "Yarn & Fabrics", employees: 24000, certifications: ["ISO 14001", "OEKO-TEX"] },
    { id: 23, name: "Trident Limited", country: "India", specialty: "Terry Towels", employees: 18000, certifications: ["GOTS", "OEKO-TEX"] },
    { id: 24, name: "Grasim Industries", country: "India", specialty: "Viscose Staple Fiber", employees: 30000, certifications: ["FSC", "OEKO-TEX"] },
    { id: 25, name: "Alok Industries", country: "India", specialty: "Cotton & Polyester", employees: 22000, certifications: ["ISO 9001"] },
    { id: 26, name: "Indo Count Industries", country: "India", specialty: "Bed Linen", employees: 15000, certifications: ["GOTS", "OEKO-TEX"] },
    { id: 27, name: "Himatsingka Seide", country: "India", specialty: "Home Textiles", employees: 12000, certifications: ["OEKO-TEX"] },
    { id: 28, name: "Kurlon Enterprise", country: "India", specialty: "Mattress & Foam", employees: 8000, certifications: ["ISO 9001"] },
    { id: 29, name: "Sutlej Textiles", country: "India", specialty: "Yarn Manufacturing", employees: 6000, certifications: ["OEKO-TEX"] },
    { id: 30, name: "Nahar Spinning Mills", country: "India", specialty: "Yarn & Denim", employees: 10000, certifications: ["ISO 14001"] },

    // Bangladesh (8)
    { id: 31, name: "DBL Group", country: "Bangladesh", specialty: "Knitwear & RMG", employees: 35000, certifications: ["LEED", "OEKO-TEX", "GOTS"] },
    { id: 32, name: "Epyllion Group", country: "Bangladesh", specialty: "Knit & Woven", employees: 25000, certifications: ["OEKO-TEX", "WRAP"] },
    { id: 33, name: "Square Fashions", country: "Bangladesh", specialty: "Woven Garments", employees: 20000, certifications: ["GOTS", "OEKO-TEX"] },
    { id: 34, name: "Ha-Meem Group", country: "Bangladesh", specialty: "Denim & Casual Wear", employees: 40000, certifications: ["WRAP", "ISO 14001"] },
    { id: 35, name: "Beximco Textiles", country: "Bangladesh", specialty: "Yarn & Fabrics", employees: 15000, certifications: ["OEKO-TEX"] },
    { id: 36, name: "Fakir Group", country: "Bangladesh", specialty: "Knits & Sweaters", employees: 30000, certifications: ["GOTS"] },
    { id: 37, name: "Envoy Textiles", country: "Bangladesh", specialty: "Denim", employees: 8000, certifications: ["LEED Gold", "OEKO-TEX"] },
    { id: 38, name: "Noman Group", country: "Bangladesh", specialty: "Yarn & Spinning", employees: 25000, certifications: ["ISO 14001"] },

    // Vietnam (6)
    { id: 39, name: "Vinatex", country: "Vietnam", specialty: "Cotton & Garments", employees: 80000, certifications: ["ISO 14001"] },
    { id: 40, name: "Phong Phu Corporation", country: "Vietnam", specialty: "Denim & Towels", employees: 10000, certifications: ["OEKO-TEX"] },
    { id: 41, name: "Thanh Cong Textile", country: "Vietnam", specialty: "Knits & Woven", employees: 8000, certifications: ["ISO 9001"] },
    { id: 42, name: "Century Synthetic Fiber", country: "Vietnam", specialty: "Polyester Fiber", employees: 3000, certifications: ["ISO 14001"] },
    { id: 43, name: "Thien Nam Group", country: "Vietnam", specialty: "Yarn & Fabrics", employees: 5000, certifications: ["OEKO-TEX"] },
    { id: 44, name: "Hoa Tho Textile", country: "Vietnam", specialty: "Garments & Fabrics", employees: 15000, certifications: ["ISO 9001"] },

    // Pakistan (6)
    { id: 45, name: "Nishat Mills", country: "Pakistan", specialty: "Cotton & Home Textiles", employees: 30000, certifications: ["GOTS", "OEKO-TEX", "BCI"] },
    { id: 46, name: "Interloop Limited", country: "Pakistan", specialty: "Hosiery & Socks", employees: 25000, certifications: ["LEED", "OEKO-TEX"] },
    { id: 47, name: "Artistic Milliners", country: "Pakistan", specialty: "Denim", employees: 20000, certifications: ["LEED Platinum", "BCI"] },
    { id: 48, name: "Sapphire Textile Mills", country: "Pakistan", specialty: "Cotton Fabrics", employees: 15000, certifications: ["OEKO-TEX", "ISO 14001"] },
    { id: 49, name: "Kohinoor Textile Mills", country: "Pakistan", specialty: "Terry Products", employees: 8000, certifications: ["GOTS"] },
    { id: 50, name: "Gul Ahmed Textile Mills", country: "Pakistan", specialty: "Home & Fashion", employees: 18000, certifications: ["OEKO-TEX"] },

    // Turkey (8)
    { id: 51, name: "Sanko Holding", country: "Turkey", specialty: "Cotton & Yarn", employees: 20000, certifications: ["ISO 14001", "OEKO-TEX"] },
    { id: 52, name: "Zorlu Holding", country: "Turkey", specialty: "Home Textiles", employees: 30000, certifications: ["OEKO-TEX"] },
    { id: 53, name: "Kipaş Holding", country: "Turkey", specialty: "Yarn & Fabrics", employees: 10000, certifications: ["BCI", "OEKO-TEX"] },
    { id: 54, name: "Yünsa", country: "Turkey", specialty: "Wool Fabrics", employees: 3000, certifications: ["ISO 9001"] },
    { id: 55, name: "Isko (Sanko)", country: "Turkey", specialty: "Premium Denim", employees: 5000, certifications: ["ZDHC", "BCI", "OEKO-TEX"] },
    { id: 56, name: "Calik Denim", country: "Turkey", specialty: "Denim Innovation", employees: 4000, certifications: ["BCI", "GOTS"] },
    { id: 57, name: "Bossa Denim", country: "Turkey", specialty: "Denim Fabrics", employees: 3500, certifications: ["OEKO-TEX"] },
    { id: 58, name: "Kordsa", country: "Turkey", specialty: "Technical Textiles", employees: 5000, certifications: ["ISO 14001"] },

    // Italy (8)
    { id: 59, name: "Loro Piana", country: "Italy", specialty: "Luxury Cashmere & Wool", employees: 2500, certifications: ["RWS", "OEKO-TEX"] },
    { id: 60, name: "Ermenegildo Zegna", country: "Italy", specialty: "Luxury Wool", employees: 7000, certifications: ["RWS"] },
    { id: 61, name: "Eurojersey", country: "Italy", specialty: "Sensitive Fabrics", employees: 500, certifications: ["OEKO-TEX", "bluesign"] },
    { id: 62, name: "Albini Group", country: "Italy", specialty: "Shirting Fabrics", employees: 2000, certifications: ["GOTS", "OEKO-TEX"] },
    { id: 63, name: "Candiani Denim", country: "Italy", specialty: "Sustainable Denim", employees: 700, certifications: ["GOTS", "Cradle to Cradle"] },
    { id: 64, name: "Limonta", country: "Italy", specialty: "Technical & Fashion", employees: 800, certifications: ["OEKO-TEX"] },
    { id: 65, name: "Ratti Group", country: "Italy", specialty: "Silk Printing", employees: 1000, certifications: ["GOTS", "OEKO-TEX"] },
    { id: 66, name: "Mantero Seta", country: "Italy", specialty: "Luxury Silk", employees: 600, certifications: ["OEKO-TEX"] },

    // USA (8)
    { id: 67, name: "Milliken & Company", country: "USA", specialty: "Technical & Innovation", employees: 7000, certifications: ["ISO 14001", "bluesign"] },
    { id: 68, name: "Mount Vernon Mills", country: "USA", specialty: "Denim & Industrial", employees: 2500, certifications: ["OEKO-TEX"] },
    { id: 69, name: "Parkdale Mills", country: "USA", specialty: "Cotton Yarn", employees: 4500, certifications: ["USCTP"] },
    { id: 70, name: "Unifi", country: "USA", specialty: "Recycled Polyester (REPREVE)", employees: 3200, certifications: ["GRS", "OEKO-TEX"] },
    { id: 71, name: "Standard Textile", country: "USA", specialty: "Healthcare & Hospitality", employees: 3000, certifications: ["OEKO-TEX"] },
    { id: 72, name: "Albany International", country: "USA", specialty: "Engineered Composites", employees: 4500, certifications: ["ISO 9001"] },
    { id: 73, name: "Burlington Industries", country: "USA", specialty: "Performance Fabrics", employees: 2000, certifications: ["bluesign"] },
    { id: 74, name: "Cone Denim", country: "USA", specialty: "Authentic Denim", employees: 1200, certifications: ["BCI", "OEKO-TEX"] },

    // Germany (4)
    { id: 75, name: "Freudenberg Group", country: "Germany", specialty: "Nonwovens & Technical", employees: 50000, certifications: ["ISO 14001", "OEKO-TEX"] },
    { id: 76, name: "TWE Group", country: "Germany", specialty: "Nonwovens", employees: 3000, certifications: ["OEKO-TEX"] },
    { id: 77, name: "Feinjersey", country: "Germany", specialty: "Circular Knits", employees: 500, certifications: ["GOTS", "OEKO-TEX"] },
    { id: 78, name: "Carl Meiser", country: "Germany", specialty: "Technical Textiles", employees: 400, certifications: ["ISO 9001"] },

    // Austria (3)
    { id: 79, name: "Lenzing AG", country: "Austria", specialty: "TENCEL & Modal Fibers", employees: 8000, certifications: ["FSC", "GOTS", "EU Ecolabel"] },
    { id: 80, name: "Salesianer Miettex", country: "Austria", specialty: "Textile Services", employees: 5000, certifications: ["OEKO-TEX"] },
    { id: 81, name: "Grabher Group", country: "Austria", specialty: "Technical Textiles", employees: 200, certifications: ["ISO 9001"] },

    // Belgium/France/Netherlands (5)
    { id: 82, name: "Libeco", country: "Belgium", specialty: "Premium Linen", employees: 300, certifications: ["European Flax", "GOTS"] },
    { id: 83, name: "Concordia Textiles", country: "Belgium", specialty: "Weaving & Finishing", employees: 400, certifications: ["OEKO-TEX"] },
    { id: 84, name: "Tenthorey (Safilin)", country: "France", specialty: "Linen Yarn", employees: 350, certifications: ["European Flax", "GOTS"] },
    { id: 85, name: "Emanuel Lang", country: "France", specialty: "Fashion Fabrics", employees: 200, certifications: ["OEKO-TEX"] },
    { id: 86, name: "Vlisco", country: "Netherlands", specialty: "African Wax Prints", employees: 2000, certifications: ["ISO 14001"] },

    // UK (3)
    { id: 87, name: "Abraham Moon & Sons", country: "UK", specialty: "British Wool", employees: 350, certifications: ["ISO 14001"] },
    { id: 88, name: "Harris Tweed Authority", country: "UK", specialty: "Harris Tweed", employees: 400, certifications: ["Protected GI"] },
    { id: 89, name: "Hainsworth", country: "UK", specialty: "Wool & Technical", employees: 300, certifications: ["ISO 9001", "ISO 14001"] },

    // Portugal/Spain (4)
    { id: 90, name: "Riopele", country: "Portugal", specialty: "Wool & Fabrics", employees: 1500, certifications: ["OEKO-TEX", "GOTS"] },
    { id: 91, name: "TMG Automotive", country: "Portugal", specialty: "Automotive Textiles", employees: 2000, certifications: ["ISO 14001"] },
    { id: 92, name: "Tavex (Santista)", country: "Spain", specialty: "Denim & Workwear", employees: 3000, certifications: ["OEKO-TEX"] },
    { id: 93, name: "Textil Santanderina", country: "Spain", specialty: "Stretch & Fashion", employees: 500, certifications: ["OEKO-TEX", "bluesign"] },

    // South Korea (4)
    { id: 94, name: "Hyosung", country: "South Korea", specialty: "Spandex (creora)", employees: 9000, certifications: ["GRS", "OEKO-TEX"] },
    { id: 95, name: "Kolon Industries", country: "South Korea", specialty: "Technical Fibers", employees: 4000, certifications: ["ISO 14001"] },
    { id: 96, name: "Huvis Corporation", country: "South Korea", specialty: "Polyester Fibers", employees: 2500, certifications: ["GRS"] },
    { id: 97, name: "TK Chemical", country: "South Korea", specialty: "Synthetic Fibers", employees: 1500, certifications: ["ISO 9001"] },

    // Brazil (3)
    { id: 98, name: "Vicunha Têxtil", country: "Brazil", specialty: "Denim & Cotton", employees: 8000, certifications: ["OEKO-TEX", "BCI"] },
    { id: 99, name: "Santista Workwear", country: "Brazil", specialty: "Workwear Fabrics", employees: 3000, certifications: ["ISO 9001"] },
    { id: 100, name: "Cedro Têxtil", country: "Brazil", specialty: "Denim & Casualwear", employees: 2500, certifications: ["OEKO-TEX"] }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { textileFactories };
}
