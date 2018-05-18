var Stremio = require("stremio-addons");

const getPosterImage = (text, background) => getImage(text, 680, 1000, background);
const getBannerImage = (text, background) => getImage(text, 758, 140, background);
const getImage = (text, width = 350, height = 350, background = 'c1c1c1', fontSize = 86, fontColor = 'ffffff') =>
    `http://placehold.jp/${fontSize}/${background}/${fontColor}/${width}x${height}.png?text=${text}`;

// Define manifest object
var manifest = {
    // See https://github.com/Stremio/stremio-addons/blob/master/docs/api/manifest.md for full explanation
    id: "org.stremio.bg",
    version: "1.0.0",
    name: "bg",
    description: "bgtv streaming",
    icon: getImage("BG tv", 256, 256),
    background: getImage('', 1024, 768),
    types: ["tv"],
    idProperty: ['bg'],
    isFree: true,
    endpoint: 'http://bg-stremio-addon.cloudno.de/stremioget/stremio/v1',
    filter: {"query.bg": {"$exists": true}, "query.type": {"$in": ["tv"]}},
    sorts: [{prop: "popularities.bg", name: "bg", types: ["tv"]}],
    contactEmail: 'hukuuu@gmail.com'
};

const data = [
    {
        id: 'bg:city',
        name: 'city tv streaming',
        poster: getPosterImage('City TV', '99ccff'),
        posterShape: 'regular',
        banner: getBannerImage('City TV', '99ccff'),
        genre: ['Music'],
        isFree: 1,
        type: 'tv',
        url: 'http://nodeb.gocaster.net:1935/CGL/mp4:TODAYFM_TEST2/playlist.m3u8'
    },
    {
        id: 'bg:btv',
        name: 'btv streaming',
        poster: getPosterImage('BTV', '000000'),
        posterShape: 'regular',
        banner: getBannerImage('BTV', '000000'),
        genre: ['Entertainment'],
        isFree: 1,
        type: 'tv',
        url: 'http://46.10.150.114/alpha/alpha/chunklist.m3u8'
    },
    {
        id: 'bg:evropa',
        name: 'evropa tv streaming',
        poster: getPosterImage('TV Evropa', 'd1d1d1'),
        posterShape: 'regular',
        banner: getBannerImage('TV Evropa', 'd1d1d1'),
        genre: ['News'],
        isFree: 1,
        type: 'tv',
        url: 'http://lb.blb.cdn.bg:2018/fls/tvevropa.stream/playlist.m3u8'
    },
    {
        id: 'bg:bgdnes',
        name: 'bgdnes tv streaming',
        poster: getPosterImage('Bulgaria Dnes', '9ad640'),
        posterShape: 'regular',
        banner: getBannerImage('Bulgaria Dnes', '9ad640'),
        genre: ['Entertainment'],
        isFree: 1,
        type: 'tv',
        url: 'http://80.72.95.40:8088'
    },
    {
        id: 'bg:bgonair',
        name: 'bgonair tv streaming',
        poster: getPosterImage('BG On Air', 'f29b54'),
        posterShape: 'regular',
        banner: getBannerImage('BG On Air', 'f29b54'),
        genre: ['News'],
        isFree: 1,
        type: 'tv',
        url: 'http://ios.cdn.bg:2006/fls/bonair.stream/playlist.m3u8'
    },
    {
        id: 'bg:thevoice',
        name: 'the voice tv streaming',
        poster: getPosterImage('The Voice', 'ffabf4'),
        posterShape: 'regular',
        banner: getBannerImage('The Voice', 'ffabf4'),
        genre: ['Music'],
        isFree: 1,
        type: 'tv',
        url: 'https://bss.neterra.tv/rtplive/thevoice_live.stream/chunklist.m3u8'
    }
];

var addon = new Stremio.Server({
    "stream.find": function (args, callback) {
        console.log("received request from stream.find", args)
        callback(null, data.filter(d => d.id === `bg:${args.query.bg}`))
    },
    "meta.find": function (args, callback) {
        console.log("received request from meta.find", args)
        callback(null, data)
    },
    "meta.get": function (args, callback) {
        console.log("received request from meta.get", args)
        // callback expects one meta element
        callback(null, data.filter(d => d.id === `bg:${args.query.bg}`)[0])
    }
}, manifest);

if (require.main === module) var server = require("http").createServer(function (req, res) {
    addon.middleware(req, res, function () {
        res.end()
    }); // wire the middleware - also compatible with connect / express
}).on("listening", function () {
    var port = server.address().port;
    console.log("Sample Stremio Addon listening on " + port);
    console.log("You can test this add-on via the web app at: http://app.strem.io/#/discover/tv?addon=" + encodeURIComponent('http://localhost:' + port))
}).listen(process.env["app_port"] || 7000);

// Export for local usage
module.exports = addon;
