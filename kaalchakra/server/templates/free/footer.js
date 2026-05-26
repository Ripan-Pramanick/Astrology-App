const generateFooter = () => {
    return `
    <div style="width: 100%; font-size: 10px; font-family: 'Arial', sans-serif; color: #707070; padding: 0 15mm; display: flex; justify-content: space-between; align-items: center; -webkit-print-color-adjust: exact;">
        
        <div style="color: #a1493b; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">
            <span style="font-size: 12px; margin-right: 4px;">ॐ</span> YourAstrologyBrand
        </div>
        
        <div style="flex-grow: 1; height: 1px; background-color: rgba(161, 73, 59, 0.3); margin: 0 15px;"></div>
        
        <div style="color: #666666; font-size: 9px;">
            Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>
        
    </div>
    `;
};

export default generateFooter;