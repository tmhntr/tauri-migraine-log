import { Card, CardContent } from "@/components/ui/card";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

// function getLocalIP() {
//   return new Promise(function(resolve, reject) {
//     // @ts-ignore
//     var RTCPeerConnection = window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

//     if (!RTCPeerConnection) {
//       reject('Your browser does not support this API');
//     }
    
//     var rtc = new RTCPeerConnection({iceServers:[]});
//     var addrs = {} as any;
//     addrs["0.0.0.0"] = false;
    
//     function grepSDP(sdp) {
//         var hosts = [];
//         var finalIP = '';
//         sdp.split('\r\n').forEach(function (line) {
//             if (~line.indexOf("a=candidate")) {
//                 var parts = line.split(' '),
//                     addr = parts[4],
//                     type = parts[7];
//                 if (type === 'host') {
//                     finalIP = addr;
//                 }
//             } else if (~line.indexOf("c=")) {
//                 var parts = line.split(' '),
//                     addr = parts[2];
//                 finalIP = addr;
//             }
//         });
//         return finalIP;
//     }
    
//     if (1 || window.mozRTCPeerConnection) {
//         rtc.createDataChannel('', {reliable:false});
//     };
    
//     rtc.onicecandidate = function (evt) {
//         if (evt.candidate) {
//           var addr = grepSDP("a="+evt.candidate.candidate);
//           resolve(addr);
//         }
//     };
//     rtc.createOffer(function (offerDesc) {
//         rtc.setLocalDescription(offerDesc);
//     }, function (e) { console.warn("offer failed", e); });
//   });
// }

export default function QRCodeCard() {
  const [localIp, setLocalIp] = useState<string | null>(null);
  useEffect(() => {
      invoke<string>("get_local_ip", {}).then((ips) => {
          console.log(ips);
          setLocalIp(ips);
      });
  }, []);
  const docUrl = localStorage.getItem("docUrl")
  return (
    <Card className="col-span-3 sm:col-span-1">
      <CardContent className="space-y-4">
      <QRCode value={`http://${localIp}:1420#${docUrl}`} />
      </CardContent>
    </Card>
  );
}
