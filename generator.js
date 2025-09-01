(function() {
    function getWifiData() {
        const authType = document.getElementById('wifi-auth-type').value;
        const ssid = document.getElementById('wifi-ssid').value;
        const password = document.getElementById('wifi-password').value;
        const isHidden = document.getElementById('wifi-hidden').checked;

        if (!ssid) return null;

        const escape = (str) => str.replace(/([\\;,":])/g, '\\$1');

        let wifiData = `WIFI:T:${escape(authType)};S:${escape(ssid)};`;
        if (authType !== 'nopass') {
            wifiData += `P:${escape(password)};`;
        }
        if (isHidden) {
            wifiData += `H:true;`;
        }
        wifiData += ';';
        return wifiData;
    }

    function getVCalendarData() {

        const title = document.getElementById('event-title').value;
        const location = document.getElementById('event-location').value;
        const description = document.getElementById('event-description').value;
        const startDate = document.getElementById('event-start-date').value;
        const startTime = document.getElementById('event-start-time').value;
        const endDate = document.getElementById('event-end-date').value;
        const endTime = document.getElementById('event-end-time').value;

        if (!title || !startDate || !startTime) return null;

        const formatToUTC = (date) => {
            return date.toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';
        };

        const dtstartObj = new Date(`${startDate} ${startTime}`);
        const dtstart = formatToUTC(dtstartObj);

        let dtend;
        if (endDate && endTime) {
            const dtendObj = new Date(`${endDate} ${endTime}`);
            dtend = formatToUTC(dtendObj);
        } else {
            const dtendObj = new Date(dtstartObj.getTime() + 60 * 60 * 1000); // Añadir 1 hora
            dtend = formatToUTC(dtendObj);
        }

        let vcal = 'BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\n';
        vcal += `SUMMARY:${title}\n`;
        if (location) vcal += `LOCATION:${location}\n`;
        if (description) vcal += `DESCRIPTION:${description}\n`;
        vcal += `DTSTART:${dtstart}\nDTEND:${dtend}\nEND:VEVENT\nEND:VCALENDAR`;
        return vcal;
    }

    function generateBarcode() {
        const state = App.state;
        if (!state.currentCategory || !state.currentCodeKey) return;

        const dataInput = document.getElementById('barcode-data');
        const errorMessage = document.getElementById('error-message');
        const saveBtn = document.getElementById('save-btn');
        const barcodeSvg = document.getElementById('barcode-svg');
        const qrCodeContainer = document.getElementById('qr-code-container');

        let data = '';
        let generationSuccess = false;
        const config = state.currentCodeConfig;

        if (state.currentCodeKey === 'event') {
            data = getVCalendarData();
        } else if (state.currentCodeKey === 'wifi') {
            data = getWifiData();
        } else {
            data = dataInput.value;
        }
        
        errorMessage.textContent = '';
        saveBtn.disabled = true;
        barcodeSvg.style.display = 'none';
        qrCodeContainer.innerHTML = '';
        qrCodeContainer.style.display = 'none';

        if (!data) return; 
        
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        const displayLineColor = isDarkMode ? '#FFFFFF' : '#000000';
        const qrBackgroundColor = isDarkMode ? '#2d3748' : '#FFFFFF';

        if (config.type === '1d') {
            barcodeSvg.style.display = 'block';
            try {
                JsBarcode(barcodeSvg, data, { format: state.currentCodeKey, lineColor: displayLineColor, background: 'transparent', width: 2, height: 100, displayValue: true, fontColor: displayLineColor });
                generationSuccess = true;
            } catch (e) {
                errorMessage.textContent = "Datos no válidos para este formato.";
            }
        } else if (config.type === '2d') {
            qrCodeContainer.style.display = 'block';
            try {
                const qr = new QRCode({ content: data, padding: 2, width: 200, height: 200, color: displayLineColor, background: qrBackgroundColor, ecl: "M", join: true });
                qrCodeContainer.innerHTML = qr.svg();
                generationSuccess = true;
            } catch (e) {
                errorMessage.textContent = "No se pudo generar el código QR.";
            }
        }
        
        if (generationSuccess) {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Guardar como SVG';
        }
    }

    function saveBarcode() {
        const state = App.state;
        if (!state.currentCategory || !state.currentCodeKey) return;

        const dataInput = document.getElementById('barcode-data');

        let data;
        let sanitizedData;
        const config = state.currentCodeConfig;

        if (state.currentCodeKey === 'event') {
            data = getVCalendarData();
            sanitizedData = (document.getElementById('event-title').value.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'evento').slice(0, 20);
        } else if (state.currentCodeKey === 'wifi') {
            data = getWifiData();
            sanitizedData = (document.getElementById('wifi-ssid').value.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'wifi').slice(0, 20);
        } else {
            data = dataInput.value;
            sanitizedData = data.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 20);
        }
        
        if (!data) return;

        const filename = `${state.currentCodeKey}_${sanitizedData}.svg`;
        let source;

        if (config.type === '1d') {
            const tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            JsBarcode(tempSvg, data, { format: state.currentCodeKey, lineColor: '#000000', background: '#FFFFFF', width: 2, height: 100, displayValue: true, fontColor: '#000000' });
            source = new XMLSerializer().serializeToString(tempSvg);
        } else if (config.type === '2d') {
            const qrForExport = new QRCode({ content: data, padding: 2, width: 200, height: 200, color: '#000000', background: '#FFFFFF', ecl: "M", join: true });
            source = qrForExport.svg();
        }

        if (!source) return;
        if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }

        const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    window.App = window.App || {};
    window.App.generator = {
        generateBarcode,
        saveBarcode
    };
})();
