export const freeReportTemplate = (data) => {

    return `
    <html>

      <body style="
        font-family: Arial;
        padding: 40px;
        background: #f8f4ea;
      ">

        <h1 style="color:#8B0000;">
          Astrology Report
        </h1>

        <h2>${data.name}</h2>

        <hr/>

        <p><b>Sunrise:</b> ${data.sunrise}</p>

        <p><b>Sunset:</b> ${data.sunset}</p>

        <p><b>Ayanamsha:</b> ${data.ayanamsha}</p>

      </body>

    </html>
    `;
};