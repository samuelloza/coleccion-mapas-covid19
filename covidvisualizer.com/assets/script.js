const START = '#380000', // Base color (at least 1 confirmed report)
    STOP = '#ff0000', // Max color (highest confirmed reports)
    NONE = '#131313'; // No color (no confirmed reports)

const COUNT_UP_OPTIONS = {
    duration: 1
}

const LIVE_RELOAD_DELAY = 300000; // Update client data every five minutes

particlesJS.load('particles', 'assets/particles.json');
MicroModal.init({
    disableScroll: true,
    awaitOpenAnimation: true,
    awaitCloseAnimation: true
});

let isMobile = false;
if (
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
        navigator.userAgent
    ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        navigator.userAgent.substr(0, 4)
    )
)
    isMobile = true;

const random = (min, max) => Math.random() * (max - min) + min;

const lerpHex = (a, b, amount) => {
    let ah = +a.replace('#', '0x'),
        ar = ah >> 16,
        ag = (ah >> 8) & 0xff,
        ab = ah & 0xff,
        bh = +b.replace('#', '0x'),
        br = bh >> 16,
        bg = (bh >> 8) & 0xff,
        bb = bh & 0xff,
        rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);

    return (
        '#' +
        (((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0).toString(16).slice(1)
    );
};

let countries; // Store each country's data
let countryColors = {}; // Store each country's hex color
let countUps = {};
let overlays = {}; // Store each country's overlay
let activeOverlay; // Save current overlay
let globe;
fetch('https://cors-anywhere.herokuapp.com/https://covidvisualizer.com/api',{ 'X-Requested-With': 'XMLHttpRequest' })
.then(res => res.json())
    .then(data => {
        // $('#total-cases').text((data.worldwide.reports - data.worldwide.deaths - data.worldwide.recovered).toLocaleString());
        // $('#total-deaths').text(data.worldwide.deaths.toLocaleString());
        // $('#total-recovered').text(data.worldwide.recovered.toLocaleString());
        $('#total-count').text('/' + data.worldwide.reports.toLocaleString());
        $('#mortality-rate').html('&nbsp;(' + (data.worldwide.deaths / data.worldwide.reports * 100).toFixed(2) + '%)');
        $('#recovery-rate').html('&nbsp;(' + (data.worldwide.recovered / data.worldwide.reports * 100).toFixed(2) + '%)');
        $('#timestamp').text(`d on ${data.timestamp}`);
        countries = data.countries;
        let reports = {}; // Array of just ISO codes and scaled reports
        // Set the legend to the max value
        $('#legend-end').text(countries[data.max].reports.toLocaleString());
        for (let iso in countries)
            reports[iso] = Math.log(countries[iso].reports) / Math.log(2);
        createGlobe(data.max, reports, countries);
        fadeIn(data.worldwide.reports, data.worldwide.deaths, data.worldwide.recovered);
        // setTimeout(() => {
        //     setIntervalAsync(fetchData, LIVE_RELOAD_DELAY)
        // }, LIVE_RELOAD_DELAY);
    }).catch(e => console.log(e));

const setIntervalAsync = (fn, ms) => {
    fn().then(() => {
        setTimeout(() => setIntervalAsync(fn, ms), ms);
    });
};

let fetchData = async () => {
    console.log("Fetching new data... updated countries:")
    fetch('https://cors-anywhere.herokuapp.com/https://covidvisualizer.com/api',{ 'X-Requested-With': 'XMLHttpRequest' })
        .then(res => res.json())
        .then(data => {
            countries = data.countries;
            for (iso in countries) {
                if (countries[iso].reports != overlays[iso].reports ||
                    countries[iso].deaths != overlays[iso].deaths ||
                    countries[iso].recovered != overlays[iso].recovered) {
                    console.log('-' + countries[iso].name);
                    overlays[iso].reports = countries[iso].reports;
                    overlays[iso].deaths = countries[iso].deaths;
                    overlays[iso].recovered = countries[iso].recovered;
                    overlays[iso].content = makeOverlay(iso, countries[iso]);
                    if (activeOverlay && activeOverlay.element.className.includes('ISO_' + iso)) {
                        countUps[iso].active.update(overlays[iso].reports);
                        countUps[iso].deaths.update(overlays[iso].deaths);
                        countUps[iso].recovered.update(overlays[iso].recovered);
                    }
                    updateGlobeListener();
                }
            }
        });
}

const createGlobe = (max, reports, countries) => {
    // Find country with highest activity to set other countries relative to
    reports[max] = 0;
    const maxReports = Math.max(...Object.values(reports));
    reports[max] = maxReports + maxReports / 2;

    // Create interpolated color for each ISO code (relative to China) Also, set a
    // white border to any countries with NEW cases/deaths
    let color,
        mapColors = '';
    for (let iso in reports) {
        color = lerpHex(START, STOP, reports[iso] / reports[max]);
        let changed =
            countries[iso].deltaCases > 0 || countries[iso].deltaDeaths > 0;
        countryColors[iso] = color;
        mapColors += `#${iso} {
            fill: ${color};
            ${changed ? 'stroke: goldenrod' : ''};
        } \ `;
    }

    $("#loader").remove();

    globe = new Earth('globe', {
        autoRotate: true,
        mapHitTest: true,
        mapLandColor: NONE,
        mapSeaColor: 'RGBA(0, 0, 0, .75)',
        mapBorderColor: 'RGBA(0, 0, 0, 0)',
        mapStyles: mapColors.slice(0, mapColors.length - 3), // Trailing "\"
        transparent: true,
        lightType: 'sun',
        lightIntensity: 1,
        zoom: isMobile ? 0.8 : 1,
        zoomable: true
    });

    let country;
    for (let iso in countries) {
        country = countries[iso];
        // if (iso == 'CN') country.reports = 1000;
        overlays[iso] = {
            reports: country.reports,
            deaths: country.deaths,
            recovered: country.recovered,
            location: {
                lat: country.lat,
                lng: country.lng
            },
            className: `ISO_${iso}`,
            content: makeOverlay(iso, country),
            events: true,
            counter: {
                active: undefined,
                deaths: undefined,
                recovered: undefined
            }
        }
    }

    globe.addEventListener('dragstart', () => {
        if (activeOverlay) activeOverlay.remove();
        globe.autoRotate = true;
    });

    $("#more-info-button").on('click', () => {
        if (activeOverlay) activeOverlay.remove();
        globe.autoRotate = true;
    });

    updateGlobeListener();
};

let updateGlobeListener = () => {
    globe.addEventListener('click', event => {
        if (activeOverlay) activeOverlay.remove();
        if (event.id) {
            if (event.id in countries) {
                globe.autoRotate = false;
                if (activeOverlay) activeOverlay.remove();
                activeOverlay = globe.addOverlay(overlays[event.id]);
                try {
                    countUps[event.id] = {
                        active: undefined,
                        deaths: undefined,
                        recovered: undefined
                    }
                    countUps[event.id].active = new CountUp(event.id + '-active', countries[event.id].reports, COUNT_UP_OPTIONS);
                    countUps[event.id].deaths = new CountUp(event.id + '-dead', countries[event.id].deaths, COUNT_UP_OPTIONS);
                    countUps[event.id].recovered = new CountUp(event.id + '-recovered', countries[event.id].recovered, COUNT_UP_OPTIONS);
                    countUps[event.id].active.start();
                    countUps[event.id].deaths.start();
                    countUps[event.id].recovered.start();
                } catch (err) {
                    console.log(err);
                    $(`#${event.id}-active`).text(countries[event.id].reports.toLocaleString());
                    $(`#${event.id}-dead`).text(countries[event.id].deaths.toLocaleString());
                    $(`#${event.id}-recovered`).text(countries[event.id].recovered.toLocaleString());
                }
                globe.goTo({
                    lat: countries[event.id].lat,
                    lng: countries[event.id].lng
                }, {
                    relativeDuration: 200,
                    zoom: isMobile ? 0.9 : 1.1
                });
            }
        }
    });
}

let makeOverlay = (iso, country) => {
    return `
        <img src="${country.flag}">
        <div class="title">
            <span><em>${country.name}</em><span><br/>
            <span class="tiny">${country.cases.toLocaleString()} total cases</span>
        </div>
        <div class="info" style="background-color: ${
            countryColors[iso]
        }">
            <span><span id="${iso}-active"></span> active</span><br/>
            <span><span id="${iso}-dead"></span> dead</span><br/>
            <span><span id="${iso}-recovered"></span> recovered</span><br/>
            ${
                country.deltaCases > 0 || country.deltaDeaths > 0
                    ? `
                        <hr>
                        <div class="changed">
                            <span style="color: goldenrod">TODAY</span><br/>
                            ${
                                country.deltaCases > 0
                                    ? `<span>+ ${country.deltaCases.toLocaleString()} cases</span><br/>`
                                    : ''
                            }
                            ${
                                country.deltaDeaths > 0
                                    ? `<span>+ ${country.deltaDeaths.toLocaleString()} deaths</span><br/>`
                                    : ''
                            }
                        </div>
                        `
                    : ''
            }
        </div>
    `
}

let fadeIn = (reports, deaths, recovered) => {
    setTimeout(() => {
        try {
            new CountUp('total-cases', reports - deaths - recovered, COUNT_UP_OPTIONS).start();
            setTimeout(() => {
                new CountUp('total-deaths', deaths, COUNT_UP_OPTIONS).start()
            }, 1000);
            setTimeout(() => {
                new CountUp('total-recovered', recovered, COUNT_UP_OPTIONS).start()
            }, 1500);
        } catch (err) {
            $('#total-cases').text((reports - deaths - recovered).toLocaleString());
            $('#total-deaths').text(deaths.toLocaleString());
            $('#total-recovered').text(recovered.toLocaleString());
        }
    }, 1000);
    $("#header").delay(500).fadeIn(500);
    $("#footer").delay(1000).fadeIn(500);
    $("#legend").delay(1500).fadeIn(500);
}