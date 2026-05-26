const generateCoverPage = (data) => {
    return `
    <style>
        /* A4 Print Setup for Puppeteer */
        @page {
            size: A4;
            margin: 0;
        }
        
        /* Base Reset */
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        /* Cover Page Container */
        .cover-page {
            width: 210mm;
            height: 297mm;
            background-color: #fdfbf3; /* Light Cream Background from image */
            color: #4a4a4a; /* Dark Gray text */
            font-family: 'Georgia', serif;
            position: relative;
            page-break-after: always;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        /* Main Ornamental Border - Maroon color from image */
        .cover-border {
            position: absolute;
            top: 15mm;
            left: 15mm;
            right: 15mm;
            bottom: 15mm;
            border: 3px solid #a1493b; /* Reddish-Brown Accent */
            outline: 1px solid #a1493b;
            outline-offset: -8mm;
            padding: 20mm;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            text-align: center;
            background-color: rgba(255, 255, 255, 0.5); /* Semi-white inner area */
        }

        /* Header Section */
        .cover-header {
            margin-top: 20mm;
        }

        .om-symbol {
            font-size: 60px;
            color: #a1493b; /* Maroon */
            margin-bottom: 20px;
        }

        .main-title {
            font-size: 42px;
            text-transform: uppercase;
            letter-spacing: 6px;
            color: #a1493b; /* Reddish-Brown text from image */
            border-bottom: 2px solid rgba(161, 73, 59, 0.4);
            padding-bottom: 15px;
            margin-bottom: 10px;
        }

        .sub-title {
            font-size: 20px;
            font-weight: 300;
            letter-spacing: 3px;
            color: #707070; /* Muted sub-text */
        }

        /* User Details Section */
        .user-section {
            margin-top: 40mm;
        }

        .prepared-for {
            font-size: 16px;
            font-style: italic;
            color: #888888;
            margin-bottom: 15px;
        }

        .user-name {
            font-size: 36px;
            font-weight: bold;
            color: #4a4a4a; /* Dark text */
            letter-spacing: 2px;
            text-transform: capitalize;
        }

        /* Footer Section */
        .cover-footer {
            margin-bottom: 10mm;
            font-family: 'Arial', sans-serif;
        }

        .website-name {
            font-size: 14px;
            color: #a1493b; /* Maroon */
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 5px;
            font-weight: bold;
        }

        .generation-date {
            font-size: 12px;
            color: #666666;
        }
    </style>

    <div class="cover-page">
        <div class="cover-border">
            <div class="cover-header">
                <div class="om-symbol">ॐ</div>
                <h1 class="main-title">Kaalchakra</h1>
                <h2 class="sub-title">Premium Horoscope Report</h2>
            </div>

            <div class="user-section">
                <div class="prepared-for">Exclusively prepared for</div>
                <div class="user-name">${data.name}</div>
            </div>

            <div class="cover-footer">
                <div class="website-name">YourAstrologyBrand.com</div>
                <div class="generation-date">Generated on: ${data.date}</div>
            </div>
        </div>
    </div>
    `;
};

export default generateCoverPage;