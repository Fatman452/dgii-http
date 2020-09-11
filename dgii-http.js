var https = require("https");
var querystring = require("querystring");

//Verificar NCF...
async function verifyVoucherNumber(rnc, ncf) {
  const viewState =
    "/wEPDwUJNjg5MDM2NzU0D2QWAmYPZBYCAgQPZBYCAgMPZBYCZg9kFgICAQ9kFgQCDw8PFgIeB1Zpc2libGVnZBYMAgEPDxYCHgRUZXh0BQkxMzA4MTE5NjJkZAIDDw8WAh8BBQpERURHQVIgU1JMZGQCBQ8PFgIfAQUSRkFDVFVSQSBERSBDT05TVU1PZGQCBw8PFgIfAQULQjAyMDA1MDU0MDhkZAIJDw8WAh8BZWRkAgsPDxYCHwEFA04vQWRkAhMPDxYIHwEFG0VsIE5DRiBkaWdpdGFkbyBlcyB2w6FsaWRvLh4IQ3NzQ2xhc3MFEGxhYmVsIGxhYmVsLWluZm8eBF8hU0ICAh8AZ2RkZCDUDRN+Kj1zQSJRZXXCGiMW8q/Rsrvx9FWoCA9Fp+Kb"; //"/wEPDwUJNjg5MDM2NzU0ZGTDGrFMJJzkCCX2Fi8SH6QinMJJKEvVoIH3iwZh+y9F3Q==";
  const eventValidation =
    "/wEdAAaSISAx4paCqZN/GoI4V6p7wojFP3bah7Ntu7hfesG3UBvWpQjDNEJRZ1WyX7dTXCyHgPx5TxVQY1OFlZqU11cF9IMJqUHiwdAK9CVWD9B6qRSbiwSLdBbDpdcRRlKBP+lzhozbqlUE+g4iN/Nk+mlKUWn0A721OTsKYLQDgZR5vQ=="; //"/wEdAAYxcFK4avpHWB3vP0KLawY+wojFP3bah7Ntu7hfesG3UBvWpQjDNEJRZ1WyX7dTXCyHgPx5TxVQY1OFlZqU11cF9IMJqUHiwdAK9CVWD9B6qRSbiwSLdBbDpdcRRlKBP+mshzgozsKnS2fDaeMKgEJSKN+9oYQPm0OXiVFQg+fhQw==";//"/wEWBAKh8pDuCgK+9LSUBQLfnOXIDAKErv7SBhjZB34//pbvvJzrbkFCGGPRElcd";
  const viewStateGenerator = "43758EFE";

  const data = querystring.stringify({
    __EVENTTARGET: "",
    __EVENTARGUMENT: "",
    __VIEWSTATE: viewState,
    __EVENTVALIDATION: eventValidation,
    __VIEWSTATEGENERATOR: viewStateGenerator,
    ctl00$cphMain$txtRNC: rnc,
    ctl00$cphMain$txtNCF: ncf,
    ctl00$cphMain$btnConsultar: "Buscar",
    ctl00$smMain: "ctl00$upMainMaster|ctl00$cphMain$btnConsultar",
    ctl00$cphMain$txtRncComprador: "",
    ctl00$cphMain$txtCodigoSeg: "",
    ASYNCPOST: "true",
  });

  const options = {
    hostname: "dgii.gov.do",
    port: 443,
    protocol: "https:",
    path: "/app/WebApps/ConsultasWeb2/ConsultasWeb/consultas/ncf.aspx",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "Content-Length": data.length,
      "User-Agent": "Localhost",
    },
  };

  const res = await (() => {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`);
        res.on("data", (d) => {
          resolve(d);
        });
      });
      //passing data
      req.write(data);

      req.on("error", (error) => {
        reject(error);
      });
      req.end();
    });
  })();
  return res;
}

async function verifyRNC(rnc, razonSocial = "") {
  const viewState =
    "/wEPDwUKMTkxNDA2Nzc4Nw9kFgJmD2QWAgIBD2QWAgIDD2QWAmYPZBYCAgEPZBYEAgEPDxYIHgRUZXh0ZR4IQ3NzQ2xhc3MFBWxhYmVsHgRfIVNCAgIeB1Zpc2libGVoZGQCBQ8WAh4Fc3R5bGUFDmRpc3BsYXk6QmxvY2s7FggCAQ8WAh8EBQ1kaXNwbGF5Ok5vbmU7ZAIDDxYCHwQFDWRpc3BsYXk6Tm9uZTtkAgUPPCsADwIADxYEHgtfIURhdGFCb3VuZGceC18hSXRlbUNvdW50AgFkChAWBGYCAQIDAgQWBDwrAAUBABYCHgpIZWFkZXJUZXh0BQtDw6lkdWxhL1JOQzwrAAUBABYCHwcFFE5vbWJyZS9SYXrDs24gU29jaWFsPCsABQEAFgIfBwUKQ2F0ZWdvcsOtYTwrAAUBABYCHwcFEVLDqWdpbWVuIGRlIHBhZ29zFgRmZmZmFgJmD2QWFGYPDxYCHwNoZGQCAQ9kFgICAQ8PFgIfAAULMTAxLTA5MDA5LTFkZAICD2QWAgIBDw8WAh8ABSRCQU5DTyBERSBBSE9SUk8gWSBDUkVESVRPIENPTkZJU0EgU0FkZAIDD2QWAgIBDw8WAh8ABSFCQU5DTyBERSBBSE9SUk8gWSBDUkVESVRPIENPTkZJU0FkZAIED2QWAgIBDw8WAh8ABQIgIGRkAgUPZBYCAgEPDxYCHwAFBk5PUk1BTGRkAgYPZBYCAgEPDxYCHwAFBkFDVElWT2RkAgcPZBYCAgEPDxYCHwAFGkJBTkNPUyBERSBBSE9SUk8gWSBDUkVESVRPZGQCCA9kFgICAQ8PFgIfAAUNQURNIExPQ0FMIEdHQ2RkAgkPDxYCHwNoZGQCBw88KwANAQAPFgIfA2hkZBgCBR9jdGwwMCRjcGhNYWluJGd2QnVzY1Jhem9uU29jaWFsD2dkBSNjdGwwMCRjcGhNYWluJGR2RGF0b3NDb250cmlidXllbnRlcw8UKwAHZGRkZGQWAAIBZIGI98sEGGrNgByS2g+HEyPBgMHQ";
  const eventValidation =
    "/wEWBQKUv/jLBgLqq//bBAKC/r/9AwKhwMi7BAKKnIvVCSzstCk5uK/Cd02rMOBr/njOZhuq";

  const data = querystring.stringify({
    __EVENTTARGET: "",
    __EVENTARGUMENT: "",
    __VIEWSTATE: viewState,
    __EVENTVALIDATION: eventValidation,
    ctl00$cphMain$txtRNCCedula: rnc,
    ctl00$cphMain$txtRazonSocial: razonSocial,
    ctl00$smMain: "ctl00$cphMain$upBusqueda|ctl00$cphMain$btnBuscarPorRNC",
    rbtnlTipoBusqueda: "0",
    ctl00$cphMain$txtRncComprador: "",
    ctl00$cphMain$txtCodigoSeg: "",
    ctl00$cphMain$btnBuscarPorRNC: "Buscar",
  });
  const options = {
    hostname: "www.dgii.gov.do",
    port: 443,
    protocol: "https:",
    path: "/app/WebApps/ConsultasWeb/consultas/rnc.aspx",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": data.length,
    },
  };

  const res = await (() => {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`);
        res.on("data", (d) => {
          resolve(d);
        });
      });
      //passing data
      req.write(data);

      req.on("error", (error) => {
        reject(error);
      });
      req.end();
    });
  })();
  return res;
}

verifyRNC("131556884", "").then((data) => {
  const info = Buffer.from(data, "base64").toString();
  const re = /<td>([A-Za-z\-0-9\s&;]+)<\/td>/g; 
  console.log(re.exec(info).slice(0, 2)); 
});
