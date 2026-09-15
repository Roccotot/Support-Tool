/* ──────────────────────────────────────────────────────────────────────────
   INVENTARIO CINEMA — sorgente unica dei dati.
   Caricato sia da index.html (dashboard NOC) sia da mappa.html (mappa
   pubblica), così esiste un solo posto da aggiornare e un solo parser.

   Formato di ogni riga (separatore: TAB):
     NomeCinema - Città - Sala - Dispositivo<TAB>IP:porta<TAB>PROTOCOLLO
   Coordinate del cinema (una riga per cinema):
     NomeCinema - Città - Coord<TAB>lat,lng<TAB>GEO
   Le righe che iniziano con // e quelle vuote vengono ignorate.
   ────────────────────────────────────────────────────────────────────────── */

const SIGRA_RAW = {
  vpn: `

Italia - Soci - Coord	43.7363,11.8113	GEO
Italia - Soci - Rete - MikroTik	10.58.85.1:161	SNMP
Italia - Soci - Sala 1 - Doremi ShowVault	10.58.85.10:161	ICMP
Italia - Soci - Sala 1 - Cinemeccanica DPC-80	10.58.85.12:161	ICMP
Italia - Soci - Sala 1 - Dolby CP500	10.58.85.14:161	ICMP



Aurelia Antica - Grosseto - Coord	42.7429,11.1068	GEO
Aurelia Antica - Grosseto - Rete - MikroTik	10.57.91.1:161	SNMP
Aurelia Antica - Grosseto - Rete - TMS\t10.57.91.2:161\tSNMP
Aurelia Antica - Grosseto - Sala 1 - Barco DP4K-19B\t10.57.91.12:161	SNMP
Aurelia Antica - Grosseto - Sala 1 - Barco ICMP\t10.57.91.12:161	SNMP
Aurelia Antica - Grosseto - Sala 1 - Dolby CP850\t10.57.91.14:161\tICMP
Aurelia Antica - Grosseto - Sala 2 - Barco DP2K-10S\t10.57.91.22:161	SNMP
Aurelia Antica - Grosseto - Sala 2 - Barco ICMP\t10.57.91.22:161	SNMP
Aurelia Antica - Grosseto - Sala 2 - Dolby CP750\t10.57.91.24:161\tICMP
Aurelia Antica - Grosseto - Sala 3 - Barco DP2K-10S\t10.57.91.32:161	SNMP
Aurelia Antica - Grosseto - Sala 3 - Barco ICMP\t10.57.91.32:161	SNMP
Aurelia Antica - Grosseto - Sala 3 - Dolby CP750\t10.57.91.34:161\tICMP
Aurelia Antica - Grosseto - Sala 4 - Barco DP2K-10S\t10.57.91.42:161	SNMP
Aurelia Antica - Grosseto - Sala 4 - Barco ICMP\t10.57.91.42:161	SNMP
Aurelia Antica - Grosseto - Sala 4 - Dolby CP750\t10.57.91.44:161\tICMP

// ─────────────────────────────────────────────────────────

Clev Village - Chiusi -SI - Coord	43.0190,11.9430	GEO
Clev Village - Chiusi -SI - Rete - MikroTik\t10.56.70.1:161\tSNMP
Clev Village - Chiusi -SI - Sala 01 - Doremi DCP2000\t10.56.70.10:161\tSNMP
Clev Village - Chiusi -SI - Sala 01 - Cinemeccanica CMC4 D2\t10.56.70.12:161\tSNMP
Clev Village - Chiusi -SI - Sala 01 - Dolby CP650\t10.56.70.14:161\tICMP
Clev Village - Chiusi -SI - Sala 02 - Doremi DCP2000\t10.56.70.20:161\tSNMP
Clev Village - Chiusi -SI - Sala 02 - Cinemeccanica CMC4 D2\t10.56.70.22:161\tSNMP
Clev Village - Chiusi -SI - Sala 02 - Dolby CP650\t10.56.70.24:161\tICMP
Clev Village - Chiusi -SI - Sala 03 - Doremi DCP2000\t10.56.70.30:161\tSNMP
Clev Village - Chiusi -SI - Sala 03 - Barco DP2K-20C\t10.56.70.32:161\tSNMP
Clev Village - Chiusi -SI - Sala 03 - Dolby CP650\t10.56.70.34:161\tICMP
Clev Village - Chiusi -SI - Sala 04 - Doremi DCP2000\t10.56.70.40:161\tSNMP
Clev Village - Chiusi -SI - Sala 04 - Barco DP2K-20C\t10.56.70.42:161\tSNMP
Clev Village - Chiusi -SI - Sala 04 - Dolby CP650\t10.56.70.44:161\tICMP
Clev Village - Chiusi -SI - Sala 05 - Doremi ShowVault\t10.56.70.50:161\tSNMP
Clev Village - Chiusi -SI - Sala 05 - Barco DP2K-10S\t10.56.70.52:161\tSNMP
Clev Village - Chiusi -SI - Sala 05 - Dolby CP650\t10.56.70.54:161\tICMP
Clev Village - Chiusi -SI - Sala 06 - Doremi ShowVault\t10.56.70.60:161\tSNMP
Clev Village - Chiusi -SI - Sala 06 - Barco DP2K-10S\t10.56.70.62:161\tSNMP
Clev Village - Chiusi -SI - Sala 06 - Dolby CP650\t10.56.70.64:161\tICMP

// ─────────────────────────────────────────────────────────

Imperiale - Montecatini Terme - Coord	43.8838,10.7725	GEO
Imperiale - Montecatini Terme - Rete - MikroTik\t10.57.97.1:161\tSNMP
Imperiale - Montecatini Terme - Rete - TMS\t10.57.97.2:161\tSNMP
Imperiale - Montecatini Terme - Sala 1 - Dolby IMS3000\t10.57.97.10:161\tSNMP
Imperiale - Montecatini Terme - Sala 1 - Cinemeccanica DPC-80\t10.57.97.12:161\tSNMP
Imperiale - Montecatini Terme - Sala 1 - Dolby CP750\t10.57.97.14:161\tICMP
Imperiale - Montecatini Terme - Sala 2 - Dolby IMS3000\t10.57.97.20:161\tSNMP
Imperiale - Montecatini Terme - Sala 2 - Barco DP2K-20C\t10.57.97.22:161\tSNMP
Imperiale - Montecatini Terme - Sala 2 - Dolby CP750\t10.57.97.24:161\tICMP
Imperiale - Montecatini Terme - Sala 3 - Barco DP2K-6E\t10.57.97.32:161	SNMP
Imperiale - Montecatini Terme - Sala 3 - Barco ICMP\t10.57.97.32:161	SNMP
Imperiale - Montecatini Terme - Sala 3 - Dolby CP750\t10.57.97.34:161\tICMP
Imperiale - Montecatini Terme - Sala 4 - Barco DP2K-6E\t10.57.97.42:161	SNMP
Imperiale - Montecatini Terme - Sala 4 - Barco ICMP\t10.57.97.42:161	SNMP
Imperiale - Montecatini Terme - Sala 4 - Dolby CP750\t10.57.97.44:161\tICMP

// ─────────────────────────────────────────────────────────

Isola Verde - Pisa - Coord	43.7102,10.4336	GEO
Isola Verde - Pisa - Rete - MikroTik\t10.58.70.1:161\tSNMP
Isola Verde - Pisa - Sala 01 - Doremi DCP2000\t10.58.70.10:161\tSNMP
Isola Verde - Pisa - Sala 01 - Barco DP2000\t10.58.70.12:161\tSNMP
Isola Verde - Pisa - Sala 01 - Dolby CP650\t10.58.70.14:161\tICMP
Isola Verde - Pisa - Sala 02 - Doremi DCP2000\t10.58.70.20:161\tSNMP
Isola Verde - Pisa - Sala 02 - Barco DP2K-20C\t10.58.70.22:161\tSNMP
Isola Verde - Pisa - Sala 02 - Dolby CP650\t10.58.70.24:161\tICMP
Isola Verde - Pisa - Sala 03 - Doremi ShowVault\t10.58.70.30:161\tSNMP
Isola Verde - Pisa - Sala 03 - Barco DP2K-15C\t10.58.70.32:161\tSNMP
Isola Verde - Pisa - Sala 03 - Dolby CP650\t10.58.70.34:161\tICMP

// ─────────────────────────────────────────────────────────

Multisala Odeon - Pisa - Coord	43.7188,10.4038	GEO
Multisala Odeon - Pisa - Rete - MikroTik\t10.55.76.1:161\tSNMP
Multisala Odeon - Pisa - Rete - TMS\t10.55.76.2:161\tSNMP
Multisala Odeon - Pisa - Sala 1 Venezia - Dolby IMS3000\t10.55.76.10:161\tSNMP
Multisala Odeon - Pisa - Sala 1 Venezia - Cinemeccanica DPC-80\t10.55.76.12:161\tSNMP
Multisala Odeon - Pisa - Sala 1 Venezia - Dolby CP750\t10.55.76.14:161\tICMP
Multisala Odeon - Pisa - Sala 1 Venezia - PC Lucilla	10.55.76.209:161	SNMP
Multisala Odeon - Pisa - Sala 2 Amalfi - Dolby IMS3000\t10.55.76.20:161\tSNMP
Multisala Odeon - Pisa - Sala 2 Amalfi - Barco DP2K-19B\t10.55.76.22:161\tSNMP
Multisala Odeon - Pisa - Sala 2 Amalfi - Dolby CP750\t10.55.76.24:161\tICMP
Multisala Odeon - Pisa - Sala 3 Pisa - Dolby IMS3000\t10.55.76.30:161\tSNMP
Multisala Odeon - Pisa - Sala 3 Pisa - Cinemeccanica DPC-80\t10.55.76.32:161\tSNMP
Multisala Odeon - Pisa - Sala 3 Pisa - Dolby CP750\t10.55.76.34:161\tICMP
Multisala Odeon - Pisa - Sala 4 Genova - Dolby IMS3000\t10.55.76.40:161\tSNMP
Multisala Odeon - Pisa - Sala 4 Genova - Barco DP2K-19B\t10.55.76.42:161\tSNMP
Multisala Odeon - Pisa - Sala 4 Genova - Dolby CP750\t10.55.76.44:161\tICMP
Multisala Odeon - Pisa - Sala 5 Kinzica - Dolby IMS3000\t10.55.76.50:161\tSNMP
Multisala Odeon - Pisa - Sala 5 Kinzica - Barco DP2K-8S\t10.55.76.52:161\tSNMP
Multisala Odeon - Pisa - Sala 5 Kinzica - Dolby CP750\t10.55.76.54:161\tICMP

// ─────────────────────────────────────────────────────────

Scipione Ammirato - Montaione - Coord	43.5526,10.9146	GEO
Scipione Ammirato - Montaione - Rete - MikroTik\t10.58.76.1:161\tSNMP
Scipione Ammirato - Montaione - Sala 1 - Doremi DCP2000\t10.58.76.10:161\tSNMP
Scipione Ammirato - Montaione - Sala 1 - Cinemeccanica CMC4 D2\t10.58.76.12:161\tSNMP
Scipione Ammirato - Montaione - Sala 1 - Dolby CP650\t10.58.76.14:161\tICMP

// ─────────────────────────────────────────────────────────

Giunti Odeon - Firenze - Coord	43.7710,11.2525	GEO
Giunti Odeon - Firenze - Rete - MikroTik\t10.58.79.1:161\tSNMP
Giunti Odeon - Firenze - Sala 1 - Barco DP4K-19B\t10.58.79.12:161\tSNMP
Giunti Odeon - Firenze - Sala 1 - Barco ICMP\t10.58.79.12:161\tSNMP
Giunti Odeon - Firenze - Sala 1 - Dolby CP750\t10.58.79.14:161\tICMP

// ─────────────────────────────────────────────────────────

Spazio Alfieri - Firenze - Coord	43.7693,11.2668	GEO
Spazio Alfieri - Firenze - Rete - MikroTik\t10.58.77.1:161\tSNMP
Spazio Alfieri - Firenze - Sala 1 - Doremi ShowVault\t10.58.77.10:161\tSNMP
Spazio Alfieri - Firenze - Sala 1 - Barco DP2K-12C\t10.58.77.12:161\tSNMP
Spazio Alfieri - Firenze - Sala 1 - JBL CPI2000\t10.58.77.14:161\tICMP

// ─────────────────────────────────────────────────────────

Excelsior - Empoli - Coord	43.7187,10.9479	GEO
Excelsior - Empoli - Rete - MikroTik\t10.58.75.1:161\tSNMP
Excelsior - Empoli - Sala 1 - Doremi ShowVault\t10.58.75.10:161\tSNMP
Excelsior - Empoli - Sala 1 - Barco DP2K-10S\t10.58.75.12:161\tSNMP
Excelsior - Empoli - Sala 1 - Dolby CP650\t10.58.75.14:161\tICMP
Excelsior - Empoli - Sala 2 - Doremi DCP2000\t10.58.75.20:161\tSNMP
Excelsior - Empoli - Sala 2 - NEC NC2000C	10.58.75.22:161	SNMP
Excelsior - Empoli - Sala 2 - Dolby CP650\t10.58.75.24:161\tICMP
Excelsior - Empoli - Sala 3 - Doremi ShowVault\t10.58.75.30:161\tSNMP
Excelsior - Empoli - Sala 3 - Barco DP2K-8S\t10.58.75.32:161\tSNMP
Excelsior - Empoli - Sala 3 - Dolby CP650\t10.58.75.34:161\tICMP

// ─────────────────────────────────────────────────────────

Nuova Aurora - Sansepolcro - Coord	43.5726,12.1386	GEO
Nuova Aurora - Sansepolcro - Rete - MikroTik\t10.58.78.1:161\tSNMP
Nuova Aurora - Sansepolcro - Sala 1 - Doremi ShowVault\t10.58.78.10:161\tSNMP
Nuova Aurora - Sansepolcro - Sala 1 - Barco DP2K-10SLP\t10.58.78.12:161\tSNMP
Nuova Aurora - Sansepolcro - Sala 1 - Dolby CP750\t10.58.78.14:161\tICMP
Nuova Aurora - Sansepolcro - Sala 2 - Barco DP2K-10S\t10.58.78.22:161\tSNMP
Nuova Aurora - Sansepolcro - Sala 2 - Barco ICMP\t10.58.78.22:161\tSNMP
Nuova Aurora - Sansepolcro - Sala 2 - Dolby CP750\t10.58.78.24:161\tICMP

// ─────────────────────────────────────────────────────────

Splendor - Massa - Coord	44.0277,10.1055	GEO
Splendor - Massa - Rete - MikroTik\t10.58.71.1:161\tSNMP
Splendor - Massa - Sala 01 - Doremi DCP2000\t10.58.71.10:161\tSNMP
Splendor - Massa - Sala 01 - Cinemeccanica DPC-80\t10.58.71.12:161\tSNMP
Splendor - Massa - Sala 01 - Dolby CP750\t10.58.71.14:161\tICMP
Splendor - Massa - Sala 02 - Doremi DCP2000\t10.58.71.20:161\tSNMP
Splendor - Massa - Sala 02 - Barco DP2K-15C\t10.58.71.22:161\tSNMP
Splendor - Massa - Sala 02 - Dolby CP750\t10.58.71.24:161\tICMP
Splendor - Massa - Sala 03 - Dolby IMS3000\t10.58.71.30:161\tSNMP
Splendor - Massa - Sala 03 - Barco DP2K-15C\t10.58.71.32:161\tSNMP
Splendor - Massa - Sala 03 - Dolby CP750\t10.58.71.34:161\tICMP
Splendor - Massa - Sala 04 - Dolby IMS3000\t10.58.71.40:161\tSNMP
Splendor - Massa - Sala 04 - Barco DP2K-12C\t10.58.71.42:161\tSNMP
Splendor - Massa - Sala 04 - Dolby CP650\t10.58.71.44:161\tICMP
Splendor - Massa - Sala 05 - Doremi DCP2000\t10.58.71.50:161\tSNMP
Splendor - Massa - Sala 05 - Barco DP2K-12C\t10.58.71.52:161\tSNMP
Splendor - Massa - Sala 05 - Dolby CP750\t10.58.71.54:161\tICMP
Splendor - Massa - Sala 06 - Dolby IMS3000\t10.58.71.60:161\tSNMP
Splendor - Massa - Sala 06 - Barco DP2K-20C\t10.58.71.62:161\tSNMP
Splendor - Massa - Sala 06 - Dolby CP750\t10.58.71.64:161\tICMP
Splendor - Massa - Sala 07 - Dolby IMS3000\t10.58.71.70:161\tSNMP
Splendor - Massa - Sala 07 - Barco DP2K-20C\t10.58.71.72:161\tSNMP
Splendor - Massa - Sala 07 - Dolby CP650\t10.58.71.74:161\tICMP

// ─────────────────────────────────────────────────────────

4 Mori - Livorno - Coord	43.5510,10.3050	GEO
4 Mori - Livorno - Rete - MikroTik\t10.58.84.1:161\tSNMP
4 Mori - Livorno - Sala 1 - Doremi DCP2000\t10.58.84.10:161\tSNMP
4 Mori - Livorno - Sala 1 - Christie CP2210\t10.58.84.12:161\tSNMP
4 Mori - Livorno - Sala 1 - Dolby CP650\t10.58.84.14:161\tICMP
4 Mori - Livorno - Sala 2 - Doremi ShowVault\t10.58.84.20:161\tSNMP
4 Mori - Livorno - Sala 2 - Barco DP2K-10S\t10.58.84.22:161\tSNMP
4 Mori - Livorno - Sala 2 - Dolby CP650\t10.58.84.24:161\tICMP

// ─────────────────────────────────────────────────────────

Teatro Giotto - Borgo San Lorenzo - Coord	43.9531,11.3895	GEO
Teatro Giotto - Borgo San Lorenzo - Rete - MikroTik\t10.58.82.1:161\tSNMP
Teatro Giotto - Borgo San Lorenzo - Sala 1 - Doremi DCP-2K4\t10.58.82.10:161\tSNMP
Teatro Giotto - Borgo San Lorenzo - Sala 1 - Barco DP2K-20C\t10.58.82.12:161\tSNMP
Teatro Giotto - Borgo San Lorenzo - Sala 1 - Dolby CP650\t10.58.82.14:161\tICMP

// ─────────────────────────────────────────────────────────

Centro Pecci - Prato - Coord	43.8613,11.1095	GEO
Centro Pecci - Prato - Rete - MikroTik\t10.58.81.1:161\tSNMP
Centro Pecci - Prato - Sala 1 - Barco DP2K-6E\t10.58.81.12:161	SNMP
Centro Pecci - Prato - Sala 1 - Barco ICMP\t10.58.81.12:161	SNMP
Centro Pecci - Prato - Sala 1 - Dolby CP750\t10.58.81.14:161\tICMP

// ─────────────────────────────────────────────────────────

Roma AB - Figline e Incisa Valdarno - Coord	43.6220,11.4720	GEO
Roma AB - Figline e Incisa Valdarno - Rete - MikroTik\t10.56.89.1:161\tSNMP
Roma AB - Figline e Incisa Valdarno - Sala 1 - Doremi ShowVault\t10.56.89.10:161\tSNMP
Roma AB - Figline e Incisa Valdarno - Sala 1 - Barco DP2K-20C\t10.56.89.12:161\tSNMP
Roma AB - Figline e Incisa Valdarno - Sala 1 - Dolby CP750	10.56.89.14:161	ICMP

// ─────────────────────────────────────────────────────────

Goldoni - Viareggio - Coord	43.8682,10.2547	GEO
Goldoni - Viareggio - Rete - MikroTik	10.58.83.1:161	SNMP
Goldoni - Viareggio - Sala 1 - Barco SP2K-11S	10.58.83.12:161	SNMP
Goldoni - Viareggio - Sala 1 - Barco ICMP	10.58.83.12:161	SNMP
Goldoni - Viareggio - Sala 1 - JBL CPI2000	10.58.83.14:161	ICMP
Goldoni - Viareggio - Sala 2 - Barco SP2K-9S	10.58.83.22:161	SNMP
Goldoni - Viareggio - Sala 2 - Barco ICMP	10.58.83.22:161	SNMP
Goldoni - Viareggio - Sala 2 - JBL CPI2000	10.58.83.24:161	ICMP

// ─────────────────────────────────────────────────────────

Flora - Firenze - Coord	43.7963,11.2410	GEO
Flora - Firenze - Rete - MikroTik	10.57.55.1:161	SNMP
Flora - Firenze - Rete - TMS	10.57.55.2:161	SNMP
Flora - Firenze - Sala 1 - Barco SP2K-9S	10.57.55.12:161	SNMP
Flora - Firenze - Sala 1 - Barco ICMP	10.57.55.12:161	SNMP
Flora - Firenze - Sala 1 - Dolby CP950	10.57.55.14:161	ICMP
Flora - Firenze - Sala 2 - Barco SP2K-7S	10.57.55.22:161	SNMP
Flora - Firenze - Sala 2 - Barco ICMP	10.57.55.22:161	SNMP
Flora - Firenze - Sala 2 - Dolby CP950	10.57.55.24:161	ICMP
Flora - Firenze - Sala 3 - Barco SP2K-7S	10.57.55.32:161	SNMP
Flora - Firenze - Sala 3 - Barco ICMP	10.57.55.32:161	SNMP
Flora - Firenze - Sala 3 - Dolby CP950	10.57.55.34:161	ICMP
Flora - Firenze - Sala 4 - Barco SP2K-9S	10.57.55.42:161	SNMP
Flora - Firenze - Sala 4 - Barco ICMP	10.57.55.42:161	SNMP
Flora - Firenze - Sala 4 - Dolby CP950	10.57.55.44:161	ICMP

Cinema Marconi - Firenze - Coord	43.7581,11.2850	GEO
Cinema Marconi - Firenze - Rete - MikroTik	10.58.61.1:161	SNMP
Cinema Marconi - Firenze - Sala Nord - Server auditorium Qube XP-D	10.58.61.10:161	SNMP
Cinema Marconi - Firenze - Sala Nord - Proiettore	10.58.61.12:161	SNMP
Cinema Marconi - Firenze - Sala Nord - Dolby CP750	10.58.61.14:161	ICMP
Cinema Marconi - Firenze - Sala Est - Server auditorium Qube XP-D	10.58.61.20:161	SNMP
Cinema Marconi - Firenze - Sala Est - Proiettore	10.58.61.22:161	SNMP
Cinema Marconi - Firenze - Sala Est - Dolby CP750	10.58.61.24:161	ICMP
Cinema Marconi - Firenze - Sala Ovest - Server auditorium Qube XP-D	10.58.61.30:161	SNMP
Cinema Marconi - Firenze - Sala Ovest - Proiettore	10.58.61.32:161	SNMP
Cinema Marconi - Firenze - Sala Ovest - Dolby CP750	10.58.61.34:161	ICMP`,
  offline: `
Teatro Bucci - San Giovanni in Valdarno - Coord	43.5610,11.5310	GEO
Puccini - Altopascio - Coord	43.8138,10.6763	GEO
Puccini - Altopascio - Sala 1 - Barco ICMP	192.168.1.10:161	ICMP
Puccini - Altopascio - Sala 1 - Barco SP2K-11S	192.168.1.12:161	ICMP
Puccini - Altopascio - Sala 1 - Dolby CP950	192.168.1.14:161	ICMP

CRC Antella - Antella - Coord	43.7272,11.3225	GEO
CRC Antella - Antella - Sala 1 - Barco DP2K-20C\t192.168.1.134:161\tICMP
CRC Antella - Antella - Sala 1 - Barco ICMP\t192.168.1.134:161\tICMP
CRC Antella - Antella - Sala 1 - Dolby CP650\t192.168.1.136:161\tICMP

Eden - Arezzo - Coord	43.4630,11.8820	GEO
Eden - Arezzo - Sala 1 - Doremi ShowVault	192.168.1.10:161	ICMP
Eden - Arezzo - Sala 1 - Barco DP2K-15C	192.168.1.12:161	ICMP
Eden - Arezzo - Sala 1 - Dolby CP750	192.168.1.14:161	ICMP
Eden - Arezzo - Sala 2 - Doremi ShowVault	192.168.1.20:161	ICMP
Eden - Arezzo - Sala 2 - Barco DP2K-8S	192.168.1.22:161	ICMP
Eden - Arezzo - Sala 2 - Dolby CP750	192.168.1.24:161	ICMP

Corsini - Barberino di Mugello - Coord	43.9988,11.2388	GEO
Corsini - Barberino di Mugello - Sala 1 - Doremi ShowVault	192.168.1.10:161	ICMP
Corsini - Barberino di Mugello - Sala 1 - Cinemeccanica DPC-80	192.168.1.12:161	ICMP
Corsini - Barberino di Mugello - Sala 1 - Dolby CP65	192.168.1.14:161	ICMP

Roma - Barga - Coord	44.0756,10.4806	GEO
Roma - Barga - Sala 1 - Doremi ShowVault	192.168.1.10:161	ICMP
Roma - Barga - Sala 1 - Barco DP2K-20C	192.168.1.12:161	ICMP
Roma - Barga - Sala 1 - Dolby CP650	192.168.1.14:161	ICMP

Borsalino - Camaiore - Coord	43.9369,10.3010	GEO
Borsalino - Camaiore - Sala 1 - Barco ICMP	192.168.1.10:161	ICMP
Borsalino - Camaiore - Sala 1 - Barco DP2K-10S	192.168.1.12:161	ICMP
Borsalino - Camaiore - Sala 1 - Dolby CP750	192.168.1.14:161	ICMP

Artè - Capannori - Coord	43.8440,10.5760	GEO
Artè - Capannori - Sala 1 - Barco ICMP	192.168.1.10:161	ICMP
Artè - Capannori - Sala 1 - Barco DP2K-10S	192.168.1.12:161	ICMP
Artè - Capannori - Sala 1 - Dolby CP750	192.168.1.14:161	ICMP

Flamingo - Capoliveri - Coord	42.7456,10.3785	GEO
Flamingo - Capoliveri - Sala 1 - Barco ICMP	192.168.1.10:161	ICMP
Flamingo - Capoliveri - Sala 1 - Barco DP2K-15C	192.168.1.12:161	ICMP
Flamingo - Capoliveri - Sala 1 - Dolby CP750	192.168.1.14:161	ICMP

Italia - Castellina in Chianti - Coord	43.4694,11.2840	GEO
Italia - Castellina in Chianti - Sala 1 - Doremi ShowVault	192.168.1.10:161	ICMP
Italia - Castellina in Chianti - Sala 1 - Barco DP2K-20C	192.168.1.12:161	ICMP
Italia - Castellina in Chianti - Sala 1 - Dolby CP750	192.168.1.14:161	ICMP

Nuovo Cinema Caporali - Castiglione del Lago - Coord	43.1210,12.0510	GEO
Nuovo Cinema Caporali - Castiglione del Lago - Sala 1 - Christie IMB-S4	192.168.1.12:161	ICMP
Nuovo Cinema Caporali - Castiglione del Lago - Sala 1 - Christie CP2411-RBe	192.168.1.12:161	ICMP
Nuovo Cinema Caporali - Castiglione del Lago - Sala 1 - Dolby CP950	192.168.1.14:161	ICMP
Nuovo Cinema Caporali - Castiglione del Lago - Sala 2 - Christie IMB-S4	192.168.1.22:161	ICMP
Nuovo Cinema Caporali - Castiglione del Lago - Sala 2 - Christie CP2406-RBe	192.168.1.22:161	ICMP
Nuovo Cinema Caporali - Castiglione del Lago - Sala 2 - Dolby CP750	192.168.1.24:161	ICMP

Teatro Signorelli - Cortona - Coord	43.2754,11.9853	GEO
Teatro Signorelli - Cortona - Sala 1 - Doremi ShowVault	192.168.1.10:161	ICMP
Teatro Signorelli - Cortona - Sala 1 - Barco DP2K-20C	192.168.1.12:161	ICMP
Teatro Signorelli - Cortona - Sala 1 - Dolby CP650	192.168.1.14:161	ICMP

Astra - Firenze - Coord	43.7713,11.2715	GEO
Astra - Firenze - Sala 1 - Barco ICMP	192.168.1.10:161	ICMP
Astra - Firenze - Sala 1 - Barco DP2K-10SLP	192.168.1.12:161	ICMP
Astra - Firenze - Sala 1 - Dolby CP950	192.168.1.14:161	ICMP

Cinema Castello - Firenze - Coord	43.8080,11.2200	GEO
Cinema Castello - Firenze - Sala 1 - Doremi ShowVault	192.168.1.10:161	ICMP
Cinema Castello - Firenze - Sala 1 - Barco DP2K-12C	192.168.1.12:161	ICMP
Cinema Castello - Firenze - Sala 1 - Dolby CP65	192.168.1.14:161	ICMP
Cinema Castello - Firenze - Sala 2 - Doremi ShowVault	192.168.1.20:161	ICMP
Cinema Castello - Firenze - Sala 2 - Barco DP2K-10S	192.168.1.22:161	ICMP
Cinema Castello - Firenze - Sala 2 - Dolby CP65	192.168.1.24:161	ICMP


Cinema Odeon - Firenze - Coord	43.7710,11.2525	GEO
Cinema Odeon - Firenze - Sala 1 - Barco ICMP	192.168.1.10:161	ICMP
Cinema Odeon - Firenze - Sala 1 - Barco DP4K-19B	192.168.1.12:161	ICMP
Cinema Odeon - Firenze - Sala 1 - Dolby CP750	192.168.1.14:161	ICMP

Everest - Firenze - Coord	43.7363,11.2227	GEO
Everest - Firenze - Sala 1 - Barco ICMP	192.168.1.10:161	ICMP
Everest - Firenze - Sala 1 - Barco DP2K-15C	192.168.1.12:161	ICMP
Everest - Firenze - Sala 1 - Dolby CP750	192.168.1.14:161	ICMP

Fiamma - Firenze - Coord	43.7831,11.2715	GEO
Fiamma - Firenze - Sala 1 - Qube XP-D	192.168.1.10:161	ICMP
Fiamma - Firenze - Sala 1 - Proiettore	192.168.1.12:161	ICMP
Fiamma - Firenze - Sala 1 - Dolby CP750	192.168.1.14:161	ICMP
Fiamma - Firenze - Sala 2 - Qube XP-D	192.168.1.20:161	ICMP
Fiamma - Firenze - Sala 2 - Proiettore	192.168.1.22:161	ICMP
Fiamma - Firenze - Sala 2 - Dolby CP750	192.168.1.24:161	ICMP


Il Portico - Firenze - Coord	43.7745,11.2780	GEO
Il Portico - Firenze - Sala 1 - Barco ICMP	192.168.1.10:161	ICMP
Il Portico - Firenze - Sala 1 - Barco SP4K-12B	192.168.1.12:161	ICMP
Il Portico - Firenze - Sala 1 - Dolby CP750	192.168.1.14:161	ICMP
Il Portico - Firenze - Sala 2 - Doremi DCP2000	192.168.1.20:161	ICMP
Il Portico - Firenze - Sala 2 - Barco DP2K-15C	192.168.1.22:161	ICMP
Il Portico - Firenze - Sala 2 - Dolby CP65	192.168.1.24:161	ICMP

Principe - Firenze - Coord	43.7825,11.2628	GEO
Principe - Firenze - Sala 1 - Qube XP-D	192.168.1.10:161	ICMP
Principe - Firenze - Sala 1 - Proiettore	192.168.1.12:161	ICMP
Principe - Firenze - Sala 1 - Dolby CP750	192.168.1.14:161	ICMP
Principe - Firenze - Sala 2 - Qube XP-D	192.168.1.20:161	ICMP
Principe - Firenze - Sala 2 - Proiettore	192.168.1.22:161	ICMP
Principe - Firenze - Sala 2 - Dolby CP750	192.168.1.24:161	ICMP

Sala Esse - Firenze - Coord	43.7688,11.2763	GEO
Sala Esse - Firenze - Sala 1 - Doremi ShowVault	192.168.1.10:161	ICMP
Sala Esse - Firenze - Sala 1 - Barco DP2K-15C	192.168.1.12:161	ICMP
Sala Esse - Firenze - Sala 1 - Dolby CP650	192.168.1.14:161	ICMP

Don Otello Puccetti - Firenzuola - Coord	44.1188,11.3780	GEO
Don Otello Puccetti - Firenzuola - Sala 1 - Doremi ShowVault	192.168.1.10:161	ICMP
Don Otello Puccetti - Firenzuola - Sala 1 - Barco DP2K-12C	192.168.1.12:161	ICMP
Don Otello Puccetti - Firenzuola - Sala 1 - Dolby CP950	192.168.1.14:161	ICMP

Puccini - Fornaci di Barga - Coord	44.0456,10.4785	GEO
Puccini - Fornaci di Barga - Sala 1 - Doremi DCP2000	192.168.1.10:161	ICMP
Puccini - Fornaci di Barga - Sala 1 - Cinemeccanica DPC-80	192.168.1.12:161	ICMP
Puccini - Fornaci di Barga - Sala 1 - Dolby CP650	192.168.1.14:161	ICMP

Nuovo Lido - Forte dei Marmi - Coord	43.9556,10.1695	GEO
Nuovo Lido - Forte dei Marmi - Sala 1 - Doremi DCP2000	192.168.1.10:161	ICMP
Nuovo Lido - Forte dei Marmi - Sala 1 - Barco DP2000	192.168.1.12:161	ICMP
Nuovo Lido - Forte dei Marmi - Sala 1 - Dolby CP650	192.168.1.14:161	ICMP
Nuovo Lido - Forte dei Marmi - Sala 2 - Barco ICMP	192.168.1.20:161	ICMP
Nuovo Lido - Forte dei Marmi - Sala 2 - Barco DP2K-15C	192.168.1.22:161	ICMP
Nuovo Lido - Forte dei Marmi - Sala 2 - Dolby CP650	192.168.1.24:161	ICMP

Teatro Pacini - Fucecchio - Coord	43.7263,10.8088	GEO
Teatro Pacini - Fucecchio - Sala 1 - Barco ICMP	192.168.1.10:161	ICMP
Teatro Pacini - Fucecchio - Sala 1 - Barco SP2K-11S	192.168.1.12:161	ICMP
Teatro Pacini - Fucecchio - Sala 1 - Dolby CP750	192.168.1.14:161	ICMP

Teatro Boito - Greve in Chianti - Coord	43.5831,11.3189	GEO
Teatro Boito - Greve in Chianti - Sala 1 - Doremi ShowVault	192.168.1.10:161	ICMP
Teatro Boito - Greve in Chianti - Sala 1 - Barco DP2K-15C	192.168.1.12:161	ICMP
Teatro Boito - Greve in Chianti - Sala 1 - Dolby CP750	192.168.1.14:161	ICMP

Florentia - Larderello - Coord	43.2394,10.8875	GEO
Florentia - Larderello - Sala 1 - Doremi ShowVault	192.168.1.10:161	ICMP
Florentia - Larderello - Sala 1 - Barco DP2K-20C	192.168.1.12:161	ICMP
Florentia - Larderello - Sala 1 - Dolby CP750	192.168.1.14:161	ICMP

Teatro delle Arti - Lastra a Signa - Coord	43.7618,11.1077	GEO
Teatro delle Arti - Lastra a Signa - Sala 1 - Doremi ShowVault	192.168.1.10:161	ICMP
Teatro delle Arti - Lastra a Signa - Sala 1 - Barco DP2K-10S	192.168.1.12:161	ICMP
Teatro delle Arti - Lastra a Signa - Sala 1 - Dolby CP750	192.168.1.14:161	ICMP

La Gran Guardia - Livorno - Coord	43.5513,10.3113	GEO
La Gran Guardia - Livorno - Sala 1 - Barco ICMP	192.168.1.10:161	ICMP
La Gran Guardia - Livorno - Sala 1 - Barco DP2K-10S	192.168.1.12:161	ICMP
La Gran Guardia - Livorno - Sala 1 - Dolby CP750	192.168.1.14:161	ICMP
La Gran Guardia - Livorno - Sala 2 - Barco ICMP	192.168.1.20:161	ICMP
La Gran Guardia - Livorno - Sala 2 - Barco DP2K-20C	192.168.1.22:161	ICMP
La Gran Guardia - Livorno - Sala 2 - Dolby CP750	192.168.1.24:161	ICMP

Teatro dei Servi - Massa - Coord	44.0397,10.1426	GEO
Teatro dei Servi - Massa - Sala 1 - Barco ICMP	192.168.1.10:161	ICMP
Teatro dei Servi - Massa - Sala 1 - Barco SP2K-9S	192.168.1.12:161	ICMP
Teatro dei Servi - Massa - Sala 1 - Dolby CP950	192.168.1.14:161	ICMP

Teatro Verdi - Monte San Savino - Coord	43.3290,11.7230	GEO
Teatro Verdi - Monte San Savino - Sala 1 - Barco DP2K-8S\t192.168.1.134:161\tICMP
Teatro Verdi - Monte San Savino - Sala 1 - Cinemeccanica Cinecloud\t192.168.1.10:161\tICMP
Teatro Verdi - Monte San Savino - Sala 1 - Dolby CP45\t192.168.1.136:161\tICMP

Cinema Excelsior - Montecatini Terme - Coord	43.8846,10.7734	GEO
Cinema Excelsior - Montecatini Terme - Sala 1 - Dolby IMS3000	192.168.1.10:161	ICMP
Cinema Excelsior - Montecatini Terme - Sala 1 - Barco DP4K-32B	192.168.1.12:161	ICMP
Cinema Excelsior - Montecatini Terme - Sala 1 - Dolby CP650	192.168.1.14:161	ICMP
Cinema Excelsior - Montecatini Terme - Sala 2 - Doremi DCP2000	192.168.1.20:161	ICMP
Cinema Excelsior - Montecatini Terme - Sala 2 - Barco DP2K-20C	192.168.1.22:161	ICMP
Cinema Excelsior - Montecatini Terme - Sala 2 - Dolby CP950	192.168.1.24:161	ICMP

Cine8 - Montevarchi - Coord	43.5363,11.5628	GEO
Cine8 - Montevarchi - Sala 1 - Qube XP-D	192.168.1.10:161	ICMP
Cine8 - Montevarchi - Sala 1 - Proiettore	192.168.1.12:161	ICMP
Cine8 - Montevarchi - Sala 1 - Processore Audio	192.168.1.14:161	ICMP
Cine8 - Montevarchi - Sala 2 - Qube XP-D	192.168.1.20:161	ICMP
Cine8 - Montevarchi - Sala 2 - Proiettore	192.168.1.22:161	ICMP
Cine8 - Montevarchi - Sala 2 - Processore Audio	192.168.1.24:161	ICMP
Cine8 - Montevarchi - Sala 3 - Qube XP-D	192.168.1.30:161	ICMP
Cine8 - Montevarchi - Sala 3 - Proiettore	192.168.1.32:161	ICMP
Cine8 - Montevarchi - Sala 3 - Processore Audio	192.168.1.34:161	ICMP
Cine8 - Montevarchi - Sala 4 - Qube XP-D	192.168.1.40:161	ICMP
Cine8 - Montevarchi - Sala 4 - Proiettore	192.168.1.42:161	ICMP
Cine8 - Montevarchi - Sala 4 - Processore Audio	192.168.1.44:161	ICMP
Cine8 - Montevarchi - Sala 5 - Qube XP-D	192.168.1.50:161	ICMP
Cine8 - Montevarchi - Sala 5 - Proiettore	192.168.1.52:161	ICMP
Cine8 - Montevarchi - Sala 5 - Processore Audio	192.168.1.54:161	ICMP
Cine8 - Montevarchi - Sala 6 - Qube XP-D	192.168.1.60:161	ICMP
Cine8 - Montevarchi - Sala 6 - Proiettore	192.168.1.62:161	ICMP
Cine8 - Montevarchi - Sala 6 - Processore Audio	192.168.1.64:161	ICMP
Cine8 - Montevarchi - Sala 7 - Qube XP-D	192.168.1.70:161	ICMP
Cine8 - Montevarchi - Sala 7 - Proiettore	192.168.1.72:161	ICMP
Cine8 - Montevarchi - Sala 7 - Processore Audio	192.168.1.74:161	ICMP
Cine8 - Montevarchi - Sala 8 - Qube XP-D	192.168.1.80:161	ICMP
Cine8 - Montevarchi - Sala 8 - Proiettore	192.168.1.82:161	ICMP
Cine8 - Montevarchi - Sala 8 - Processore Audio	192.168.1.84:161	ICMP

Comunale - Pietrasanta - Coord	43.9575,10.2305	GEO
Comunale - Pietrasanta - Sala 1 - Doremi DCP-2K4	192.168.1.10:161	ICMP
Comunale - Pietrasanta - Sala 1 - Cinemeccanica DPC-80	192.168.1.12:161	ICMP
Comunale - Pietrasanta - Sala 1 - Dolby CP750	192.168.1.14:161	ICMP

Cinema Metropolitan - Piombino - Coord	42.9240,10.5310	GEO
Cinema Metropolitan - Piombino - Sala 1 - Doremi DCP2000	192.168.1.10:161	ICMP
Cinema Metropolitan - Piombino - Sala 1 - Cinemeccanica DPC-80	192.168.1.12:161	ICMP
Cinema Metropolitan - Piombino - Sala 1 - Dolby CP55	192.168.1.14:161	ICMP

Arno - Pisa - Coord	43.7106,10.3865	GEO
Arno - Pisa - Sala 1 - Doremi ShowVault	192.168.1.10:161	ICMP
Arno - Pisa - Sala 1 - Barco DP2K-12C	192.168.1.12:161	ICMP
Arno - Pisa - Sala 1 - Dolby CP750	192.168.1.14:161	ICMP

Arsenale - Pisa - Coord	43.7138,10.4035	GEO
Arsenale - Pisa - Sala 1 - Doremi ShowVault	192.168.1.10:161	ICMP
Arsenale - Pisa - Sala 1 - Christie CP2210	192.168.1.12:161	ICMP
Arsenale - Pisa - Sala 1 - Dolby CP750	192.168.1.14:161	ICMP

Caffè Lanteri - Pisa - Coord	43.7140,10.4200	GEO
Caffè Lanteri - Pisa - Sala 1 - Christie IMB-S4	192.168.1.12:161	ICMP
Caffè Lanteri - Pisa - Sala 1 - Christie CP2411-RBe	192.168.1.12:161	ICMP
Caffè Lanteri - Pisa - Sala 1 - JBL CPI2000	192.168.1.14:161	ICMP

Lux - Pistoia - Coord	43.9313,10.9138	GEO
Lux - Pistoia - Sala 1 - Qube XP-D	192.168.1.10:161	ICMP
Lux - Pistoia - Sala 1 - Proiettore	192.168.1.12:161	ICMP
Lux - Pistoia - Sala 1 - Dolby CP750	192.168.1.14:161	ICMP
Lux - Pistoia - Sala 2 - Qube XP-D	192.168.1.20:161	ICMP
Lux - Pistoia - Sala 2 - Proiettore	192.168.1.22:161	ICMP
Lux - Pistoia - Sala 2 - Dolby CP750	192.168.1.24:161	ICMP
Lux - Pistoia - Sala 3 - Qube XP-D	192.168.1.30:161	ICMP
Lux - Pistoia - Sala 3 - Proiettore	192.168.1.32:161	ICMP
Lux - Pistoia - Sala 3 - Dolby CP750	192.168.1.34:161	ICMP
Lux - Pistoia - Sala 4 - Qube XP-D	192.168.1.40:161	ICMP
Lux - Pistoia - Sala 4 - Proiettore	192.168.1.42:161	ICMP
Lux - Pistoia - Sala 4 - Dolby CP650	192.168.1.44:161	ICMP

Accademia - Pontassieve - Coord	43.7744,11.4400	GEO
Accademia - Pontassieve - Sala 1 - Doremi ShowVault	192.168.1.10:161	ICMP
Accademia - Pontassieve - Sala 1 - Barco DP2K-19B	192.168.1.12:161	ICMP
Accademia - Pontassieve - Sala 1 - Dolby CP750	192.168.1.14:161	ICMP

Agorà - Pontedera - Coord	43.6640,10.6370	GEO
Agorà - Pontedera - Sala 1 - Doremi ShowVault	192.168.1.10:161	ICMP
Agorà - Pontedera - Sala 1 - Barco DP2K-20C	192.168.1.12:161	ICMP
Agorà - Pontedera - Sala 1 - Dolby CP650	192.168.1.14:161	ICMP

Nello Santi - Portoferraio - Coord	42.8163,10.3313	GEO
Nello Santi - Portoferraio - Sala 1 - Doremi ShowVault	192.168.1.10:161	ICMP
Nello Santi - Portoferraio - Sala 1 - Barco DP2K-19B	192.168.1.12:161	ICMP
Nello Santi - Portoferraio - Sala 1 - Dolby CP950	192.168.1.14:161	ICMP

Cinema Eden - Prato - Coord	43.8800,11.0960	GEO
Cinema Eden - Prato - Sala 1 - Doremi DCP2000	192.168.1.10:161	ICMP
Cinema Eden - Prato - Sala 1 - Barco DP2000	192.168.1.12:161	ICMP
Cinema Eden - Prato - Sala 1 - Dolby CP750	192.168.1.14:161	ICMP
Cinema Eden - Prato - Sala 2 - Doremi ShowVault	192.168.1.20:161	ICMP
Cinema Eden - Prato - Sala 2 - Barco DP2K-10S	192.168.1.22:161	ICMP
Cinema Eden - Prato - Sala 2 - Dolby CP65	192.168.1.24:161	ICMP
Cinema Eden - Prato - Sala 3 - Doremi ShowVault	192.168.1.30:161	ICMP
Cinema Eden - Prato - Sala 3 - Barco DP2K-10S	192.168.1.32:161	ICMP
Cinema Eden - Prato - Sala 3 - Dolby CP65	192.168.1.34:161	ICMP

Terminale - Prato - Coord	43.8769,11.0955	GEO
Terminale - Prato - Sala 1 - Doremi ShowVault	192.168.1.10:161	ICMP
Terminale - Prato - Sala 1 - Barco DP2K-15C	192.168.1.12:161	ICMP
Terminale - Prato - Sala 1 - Dolby CP55	192.168.1.14:161	ICMP

Misericordia - Radda in Chianti - Coord	43.4876,11.3758	GEO
Misericordia - Radda in Chianti - Sala 1 - Doremi ShowVault	192.168.1.10:161	ICMP
Misericordia - Radda in Chianti - Sala 1 - Barco DP2K-10S	192.168.1.12:161	ICMP
Misericordia - Radda in Chianti - Sala 1 - Dolby CP65	192.168.1.14:161	ICMP

Cinema Excelsior - Reggello - Coord	43.6870,11.5370	GEO
Cinema Excelsior - Reggello - Sala 1 - Doremi ShowVault	192.168.1.10:161	ICMP
Cinema Excelsior - Reggello - Sala 1 - Barco DP2K-20C	192.168.1.12:161	ICMP
Cinema Excelsior - Reggello - Sala 1 - Dolby CP750	192.168.1.14:161	ICMP

Teatro Bucci - San Giovanni in Valdarno - Sala 1 - Barco SP4K-15B\t192.168.1.134:161\tICMP
Teatro Bucci - San Giovanni in Valdarno - Sala 1 - Barco ICMP\t192.168.1.134:161\tICMP
Teatro Bucci - San Giovanni in Valdarno - Sala 1 - Dolby CP950\t192.168.1.136:161\tICMP

Cinema Verdi - San Vincenzo - Coord	43.1030,10.5390	GEO
Cinema Verdi - San Vincenzo - Sala 1 - Doremi ShowVault	192.168.1.10:161	ICMP
Cinema Verdi - San Vincenzo - Sala 1 - Barco DP2K-10S	192.168.1.12:161	ICMP
Cinema Verdi - San Vincenzo - Sala 1 - Dolby CP750	192.168.1.14:161	ICMP

Lami - Santa Croce sull'Arno - Coord	43.7088,10.7788	GEO
Lami - Santa Croce sull'Arno - Sala 1 - Qube XP-D	192.168.1.10:161	ICMP
Lami - Santa Croce sull'Arno - Sala 1 - Proiettore	192.168.1.12:161	ICMP
Lami - Santa Croce sull'Arno - Sala 1 - Processore Audio	192.168.1.14:161	ICMP
Lami - Santa Croce sull'Arno - Sala 2 - Qube XP-D	192.168.1.20:161	ICMP
Lami - Santa Croce sull'Arno - Sala 2 - Proiettore	192.168.1.22:161	ICMP
Lami - Santa Croce sull'Arno - Sala 2 - Processore Audio	192.168.1.24:161	ICMP
Lami - Santa Croce sull'Arno - Sala 3 - Qube XP-D	192.168.1.30:161	ICMP
Lami - Santa Croce sull'Arno - Sala 3 - Proiettore	192.168.1.32:161	ICMP
Lami - Santa Croce sull'Arno - Sala 3 - Processore Audio	192.168.1.34:161	ICMP
Lami - Santa Croce sull'Arno - Sala 4 - Qube XP-D	192.168.1.40:161	ICMP
Lami - Santa Croce sull'Arno - Sala 4 - Proiettore	192.168.1.42:161	ICMP
Lami - Santa Croce sull'Arno - Sala 4 - Processore Audio	192.168.1.44:161	ICMP
Lami - Santa Croce sull'Arno - Sala 5 - Qube XP-D	192.168.1.50:161	ICMP
Lami - Santa Croce sull'Arno - Sala 5 - Proiettore	192.168.1.52:161	ICMP
Lami - Santa Croce sull'Arno - Sala 5 - Processore Audio	192.168.1.54:161	ICMP

Cabiria - Scandicci - Coord	43.7540,11.1820	GEO
Cabiria - Scandicci - Sala 1 - Doremi DCP-2K4	192.168.1.10:161	ICMP
Cabiria - Scandicci - Sala 1 - Barco DP2K-15C	192.168.1.12:161	ICMP
Cabiria - Scandicci - Sala 1 - JBL CPI2000	192.168.1.14:161	ICMP
Cabiria - Scandicci - Sala 2 - Doremi ShowVault	192.168.1.20:161	ICMP
Cabiria - Scandicci - Sala 2 - Barco DP2K-10S	192.168.1.22:161	ICMP
Cabiria - Scandicci - Sala 2 - Dolby CP45	192.168.1.24:161	ICMP

Cinema Garibaldi - Scarperia e San Piero - Coord	43.9950,11.3557	GEO
Cinema Garibaldi - Scarperia e San Piero - Sala 1 - Cinemeccanica CMC4	192.168.1.10:161	ICMP
Cinema Garibaldi - Scarperia e San Piero - Sala 1 - Barco DP2000	192.168.1.12:161	ICMP
Cinema Garibaldi - Scarperia e San Piero - Sala 1 - Dolby CP45	192.168.1.14:161	ICMP

Scuderie Granducali - Seravezza - Coord	43.9940,10.2200	GEO
Scuderie Granducali - Seravezza - Sala 1 - Barco ICMP	192.168.1.10:161	ICMP
Scuderie Granducali - Seravezza - Sala 1 - Barco DP2K-6E	192.168.1.12:161	ICMP
Scuderie Granducali - Seravezza - Sala 1 - Dolby CP750	192.168.1.14:161	ICMP

Metropolitan - Siena - Coord	43.3204,11.3285	GEO
Metropolitan - Siena - Sala 1 - Doremi ShowVault	192.168.1.10:161	ICMP
Metropolitan - Siena - Sala 1 - Barco DP2K-20C	192.168.1.12:161	ICMP
Metropolitan - Siena - Sala 1 - Dolby CP65	192.168.1.14:161	ICMP

Pendola - Siena - Coord	43.3138,11.3288	GEO
Pendola - Siena - Sala 1 - Doremi ShowVault	192.168.1.10:161	ICMP
Pendola - Siena - Sala 1 - Barco DP2K-20C	192.168.1.12:161	ICMP
Pendola - Siena - Sala 1 - Dolby CP650	192.168.1.14:161	ICMP

Cinema Centrale - Viareggio - Coord	43.8676,10.2487	GEO
Cinema Centrale - Viareggio - Sala 1 - Doremi ShowVault	192.168.1.10:161	ICMP
Cinema Centrale - Viareggio - Sala 1 - Barco DP2K-20C	192.168.1.12:161	ICMP
Cinema Centrale - Viareggio - Sala 1 - Dolby CP750	192.168.1.14:161	ICMP

Città di Villafranca - Villafranca in Lunigiana - Coord	44.2940,9.9490	GEO
Città di Villafranca - Villafranca in Lunigiana - Sala 1 - Doremi ShowVault	192.168.1.10:161	ICMP
Città di Villafranca - Villafranca in Lunigiana - Sala 1 - Barco DP2K-10S	192.168.1.12:161	ICMP
Città di Villafranca - Villafranca in Lunigiana - Sala 1 - Dolby CP750	192.168.1.14:161	ICMP

Centrale - Volterra - Coord	43.4019,10.8615	GEO
Centrale - Volterra - Sala 1 - Doremi ShowVault	192.168.1.10:161	ICMP
Centrale - Volterra - Sala 1 - Barco DP2K-10S	192.168.1.12:161	ICMP
Centrale - Volterra - Sala 1 - Dolby CP750	192.168.1.14:161	ICMP
Centrale - Volterra - Sala 2 - Doremi ShowVault	192.168.1.20:161	ICMP
Centrale - Volterra - Sala 2 - Barco DP2K-20C	192.168.1.22:161	ICMP
Centrale - Volterra - Sala 2 - Dolby CP750	192.168.1.24:161	ICMP

Teatro delle Arti - Lastra a Signa - Coord	43.769211802783055,11.106375036015722	GEO
Teatro delle Arti - Lastra a Signa - Sala 1 - Doremi ShowVault	192.168.1.10:161	ICMP
Teatro delle Arti - Lastra a Signa - Sala 1 - Barco DP2K-10S	192.168.1.12:161	ICMP
Teatro delle Arti - Lastra a Signa - Sala 1 - Dolby CP750	192.168.1.14:161	ICMP

25hours Hotel - Firenze - Coord	43.7712,11.2490	GEO
25hours Hotel - Firenze - Sala 1 - Barco DP2K-6E	192.168.1.10:161	ICMP
25hours Hotel - Firenze - Sala 1 - Barco Alchemy	192.168.1.12:161	ICMP
25hours Hotel - Firenze - Sala 1 - Dolby CP750	192.168.1.14:161	ICMP

La Compagnia - Firenze - Coord	43.7788,11.2591	GEO
La Compagnia - Firenze - Sala 1 - Barco DP4K-B	192.168.1.10:161	ICMP
La Compagnia - Firenze - Sala 1 - Barco Alchemy	192.168.1.12:161	ICMP
La Compagnia - Firenze - Sala 1 - Dolby CP750	192.168.1.14:161	ICMP

`,
  estivi: `
Flog - Firenze - Coord	43.7930,11.2460	GEO
Flog - Firenze - Sala 1 - Doremi ShowVault	192.168.1.10:161	ICMP
Flog - Firenze - Sala 1 - Barco DP2K-15C	192.168.1.12:161	ICMP

Rocca del Leone - Castiglione del Lago - Coord	43.1276,12.0556	GEO
Rocca del Leone - Castiglione del Lago - Sala 1 - Doremi DCP2000	192.168.1.10:161	ICMP
Rocca del Leone - Castiglione del Lago - Sala 1 - Barco DP2K-12C	192.168.1.12:161	ICMP
Rocca del Leone - Castiglione del Lago - Sala 1 - Mixer Amplificato	192.168.1.14:161	ICMP

Cinema Estivo - Scarperia e San Piero - Coord	43.9937,11.3533	GEO
Cinema Estivo - Scarperia e San Piero - Sala 1 - Proiettore Acer	192.168.1.10:161	ICMP
Cinema Estivo - Scarperia e San Piero - Sala 1 - Blu-ray Denon	192.168.1.12:161	ICMP
Cinema Estivo - Scarperia e San Piero - Sala 1 - Mixer Amplificato	192.168.1.14:161	ICMP

Cinema Chiardiluna - Firenze - Coord	43.7697,11.2345	GEO
Cinema Chiardiluna - Firenze - Sala 1 - Doremi DCP-2K4	192.168.1.10:161	ICMP
Cinema Chiardiluna - Firenze - Sala 1 - Barco DP2K-10S	192.168.1.12:161	ICMP
Cinema Chiardiluna - Firenze - Sala 1 - JBL CPI2000	192.168.1.14:161	ICMP
Cinema Chiardiluna - Firenze - Sala 2 - Doremi DCP-2K4	192.168.1.20:161	ICMP
Cinema Chiardiluna - Firenze - Sala 2 - Barco DP2K-15C	192.168.1.22:161	ICMP

Cinema Estivo Roma - Pisa - Coord	43.7260,10.3976	GEO
Cinema Estivo Roma - Pisa - Sala 1 - Cinemeccanica CMC4	192.168.1.10:161	ICMP
Cinema Estivo Roma - Pisa - Sala 1 - Doremi ShowVault	192.168.1.12:161	ICMP
Cinema Estivo Roma - Pisa - Sala 2 - Barco DP2K-12C	192.168.1.20:161	ICMP
Cinema Estivo Roma - Pisa - Sala 2 - Doremi DCP2000	192.168.1.22:161	ICMP
Cinema Estivo Roma - Pisa - Sala 2 - Mixer Amplificato	192.168.1.24:161	ICMP

Arena Estiva Castello - Firenze - Coord	43.8080,11.2200	GEO
Arena Estiva Castello - Firenze - Giardino - Doremi ShowVault	192.168.1.10:161	ICMP
Arena Estiva Castello - Firenze - Giardino - Barco DP2K-12C	192.168.1.12:161	ICMP
Arena Estiva Castello - Firenze - Giardino - Mixer Amplificato	192.168.1.14:161	ICMP

Arena Estiva - Lastra a Signa - Coord	43.7618,11.1077	GEO

Castello dell'Imperatore - Prato - Coord	43.8800,11.0940	GEO
Castello dell'Imperatore - Prato - Arena - Doremi ShowVault	192.168.1.10:161	ICMP
Castello dell'Imperatore - Prato - Arena - Barco DP2K-15C	192.168.1.12:161	ICMP
Castello dell'Imperatore - Prato - Arena - Dolby CP55	192.168.1.14:161	ICMP

Cinema Castello - Castiglione della Pescaia - Coord	42.7610,10.8800	GEO
Cinema Castello - Castiglione della Pescaia - Arena - Barco DP2K-10S	192.168.1.10:161	ICMP
Cinema Castello - Castiglione della Pescaia - Arena - Barco ICMP	192.168.1.12:161	ICMP
Cinema Castello - Castiglione della Pescaia - Arena - Mixer Amplificato	192.168.1.14:161	ICMP

Cinema Estivo - Montespertoli - Coord	43.6426,11.0733	GEO
Cinema Estivo - Montespertoli - Giardino - Barco DP2K-10S	192.168.1.10:161	ICMP
Cinema Estivo - Montespertoli - Giardino - Barco ICMP	192.168.1.12:161	ICMP
Cinema Estivo - Montespertoli - Giardino - Mixer Amplificato	192.168.1.14:161	ICMP

Arena Pitti - Firenze - Coord	43.7654,11.2497	GEO
Arena Pitti - Firenze - Piazza - Videoproiettore digitale	192.168.1.10:161	ICMP
Arena Pitti - Firenze - Piazza - Mixer Amplificato	192.168.1.12:161	ICMP

Cinema sotto le stelle - Sansepolcro - Coord	43.5726,12.1386	GEO
Cinema sotto le stelle - Sansepolcro - Chiostro - Barco DP2K-10S	192.168.1.10:161	ICMP
Cinema sotto le stelle - Sansepolcro - Chiostro - Dolby CP750	192.168.1.12:161	ICMP

Arena Ardenza - Livorno - Coord	43.5270,10.3010	GEO

Arena Fabbricotti - Livorno - Coord	43.5540,10.3080	GEO

Arena Estiva Eden - Arezzo - Coord	43.4630,11.8820	GEO
Arena Estiva Eden - Arezzo - Giardino - Doremi ShowVault	192.168.1.10:161	ICMP
Arena Estiva Eden - Arezzo - Giardino - Barco DP2K-15C	192.168.1.12:161	ICMP
Arena Estiva Eden - Arezzo - Giardino - Dolby CP750	192.168.1.14:161	ICMP

Arena Stadio - Siena - Coord	43.3120,11.3175	GEO
Arena Stadio - Siena - Stadio - Doremi ShowVault	192.168.1.10:161	ICMP
Arena Stadio - Siena - Stadio - Barco DP2K-20C	192.168.1.12:161	ICMP
Arena Stadio - Siena - Stadio - Dolby CP650	192.168.1.14:161	ICMP

Cinema nel Parco Villa Renatico Martini - Monsummano Terme - Coord	43.8692,10.8146	GEO
Cinema nel Parco Villa Renatico Martini - Monsummano Terme - Arena - Cinemeccanica CMC4	192.168.1.10:161	ICMP
Cinema nel Parco Villa Renatico Martini - Monsummano Terme - Arena - Doremi DCP2000	192.168.1.12:161	ICMP

Cinema Estivo Cinquale - Montignoso - Coord	43.9790,10.1422	GEO
Cinema Estivo Cinquale - Montignoso - Arena - Barco DP2K-10S	192.168.1.10:161	ICMP
Cinema Estivo Cinquale - Montignoso - Arena - Barco ICMP	192.168.1.12:161	ICMP
Cinema Estivo Cinquale - Montignoso - Arena - Mixer Amplificato	192.168.1.14:161	ICMP

Cinema sotto le stelle - Pontedera - Coord	43.6614,10.6307	GEO
Cinema sotto le stelle - Pontedera - Arena - Doremi ShowVault	192.168.1.10:161	ICMP
Cinema sotto le stelle - Pontedera - Arena - Barco DP2K-20C	192.168.1.12:161	ICMP
Cinema sotto le stelle - Pontedera - Arena - Dolby CP650	192.168.1.14:161	ICMP

Cinema nel Chiostro - Firenze - Coord	43.7793,11.2463	GEO
Cinema nel Chiostro - Firenze - Arena - Doremi ShowVault	192.168.1.10:161	ICMP
Cinema nel Chiostro - Firenze - Arena - Barco DP2K-12C	192.168.1.12:161	ICMP
Cinema nel Chiostro - Firenze - Arena - JBL CPI2000	192.168.1.14:161	ICMP

Arena Dentro Le Mura - San Casciano in Val di Pesa - Coord	43.6598,11.1849	GEO
Arena Dentro Le Mura - San Casciano in Val di Pesa - Arena - Barco DP2K-15C	192.168.1.10:161	ICMP
Arena Dentro Le Mura - San Casciano in Val di Pesa - Arena - Doremi DCP2000	192.168.1.12:161	ICMP
Arena Dentro Le Mura - San Casciano in Val di Pesa - Arena - Mixer Amplificato	192.168.1.14:161	ICMP

Arena Estiva - Chiusi - Coord	43.0019,11.9550	GEO
Arena Estiva - Chiusi - Arena - Doremi DCP2000	192.168.1.10:161	ICMP
Arena Estiva - Chiusi - Arena - Barco DP2K-20C	192.168.1.12:161	ICMP
Arena Estiva - Chiusi - Arena - Dolby CP650	192.168.1.14:161	ICMP
Arena Estiva - Chiusi - Arena - Barco DP2K-10S	192.168.1.16:161	ICMP

Arena Estiva - Chianciano Terme - Coord	43.0418,11.8121	GEO
Arena Estiva - Chianciano Terme - Arena - Doremi ShowVault	192.168.1.10:161	ICMP
Arena Estiva - Chianciano Terme - Arena - Barco DP2K-10S	192.168.1.12:161	ICMP
Arena Estiva - Chianciano Terme - Arena - Dolby CP650	192.168.1.14:161	ICMP

Tassignano Artemisia - Capannori - Coord	43.8270,10.5840	GEO
Tassignano Artemisia - Capannori - Arena - Barco DP2K-10S	192.168.1.10:161	ICMP

Arena Estiva - Poggio a Caiano - Coord	43.8155,11.0583	GEO

Schermo Quinto Martini - Seano - Coord	43.8308,11.0211	GEO

La Meta - Livorno - Coord	43.5242,10.3164	GEO
La Meta - Livorno - Arena - Doremi ShowVault	192.168.1.10:161	ICMP
La Meta - Livorno - Arena - Barco DP2K-10S	192.168.1.12:161	ICMP
La Meta - Livorno - Arena - Dolby CP65	192.168.1.14:161	ICMP

Cinema Estivo - Pistoia - Coord	43.9371,10.9126	GEO
`,
};

// Coordinate di fallback per città, usate solo dai cinema senza riga GEO.
const SIGRA_COORDS = {
  vpn: {
  'Grosseto':                    [42.7629, 11.1121],
  'Chiusi':                      [43.0146, 11.9454],
  'Montecatini Terme':           [43.8847, 10.7728],
  'Pisa':                        [43.7228, 10.4017],
  'Sansepolcro':                 [43.5693, 12.1396],
  'Massa':                       [44.0355, 10.1398],
  'Empoli':                      [43.7193, 10.9497],
  'Firenze':                     [43.7696, 11.2558],
  'Prato':                       [43.8799, 10.9970],
  'Figline e Incisa Valdarno':   [43.6248, 11.4672],
  'Montaione':                   [43.5586, 10.9137],
  'Borgo San Lorenzo':           [43.9552, 11.3876],
  'Livorno':                     [43.5479, 10.3146],
  'Viareggio':                   [43.8677, 10.2519],
  },
  offline: {
  'San Giovanni in Valdarno':    [43.5632, 11.5218],
  'Antella':                     [43.7398, 11.3047],
  'Monte San Savino':            [43.3294, 11.7268],
  },
  estivi: {
  'Firenze':                     [43.7696, 11.2558],
  'Castiglione del Lago':        [43.1210, 12.0510],
  'Scarperia e San Piero':       [43.9950, 11.3557],
  'Pisa':                        [43.7228, 10.4017],
  },
};
