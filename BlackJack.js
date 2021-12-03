var kortene = [];
var SpillerKort = [];
var DealersKort = [];
var UddelteKort = 0;
var Kulør = ["spades","hearts","diams","clubs"];
var Nummer = ["A","2","3","4","5","6","7","8","9","10","B","D","K"];
var SpilPenge = 200;
var Beløb = document.getElementById("Beløb");
var Penge = document.getElementById("Penge");
var BeløbErIndsat = false;
var SKortVærdi = document.getElementById("SKortVærdi");
var DKortVærdi = document.getElementById("DKortVærdi");
var Besked = document.getElementById("Besked");
var SpilSlut = false;
var output = "";

for (i = 0; i < Kulør.length; i++) {
	var stortbog = Kulør[i][0].toUpperCase();
	var ikonfarve = (stortbog == "S" || stortbog == "C") ? "black" : "red";
	
	for (j = 0; j < Nummer.length; j++){
	var kortværdi = (j > 9) ? 10 : j + 1;
	var kort = {kulør:stortbog, ikon:Kulør[i], ikonfarve:ikonfarve, kortnum:Nummer[j], kortværdi:kortværdi};
	kortene.push(kort);

	};
};

Penge.innerHTML = SpilPenge;

function IndsætBeløb(){
	if (Beløb.value > SpilPenge) {
		alert("Du kan ikke sætte flere penge ind end du har til rådighed!");
		return;
	}
	else if (Beløb.value == 0) {
		alert("Du skal indsætte et beløb!");
		return;
	}
	document.getElementById("IndsatBeløb").innerHTML = Beløb.value;
	SpilPenge = SpilPenge - Beløb.value;
	Penge.innerHTML = SpilPenge;
	BeløbErIndsat = true;
	document.getElementById("IndsætKnap").style.display = "none";
	document.getElementById("Beløb").style.display = "none";
	Beløb.value = "";
	return;
}

function BlandeKort(liste) {
	for (var i = liste.length - 1; i > 0; i--) {
		var Tilfæld = Math.floor(Math.random()*(i+1));
		var holder = liste[i];
		liste[i] = liste[Tilfæld];
		liste[Tilfæld] = holder;
	}
	return liste;
}

function NytSæt() {
	if (UddelteKort > 40) {
	BlandeKort(kortene);
	UddelteKort = 0;
	}
	UddelteKort++;
}

function Kortdisplay(n, i) {
	var position = (i>0) ? i*11+ 30 : 30;
	return '<div class="kort ' + kortene[n].ikon + '" style="left:' + position + '%"> <div class="Øverste-del kulør">' + kortene[n].kortnum + '<br></div><div class="Midterste-del kulør"></div><div class="Nederste-del kulør">' + kortene[n].kortnum + '<br></div> </div>';
}

function KortUddeling() {
	DKortVærdi.innerHTML = "?";
	SpillerKort = [];
	DealersKort = [];
	document.getElementById("SpillersHånd").innerHTML =  "";
	document.getElementById("DealersHånd").innerHTML = "";

	for (i = 0; i < 2; i++) {
		DealersKort.push(kortene[UddelteKort]);
		document.getElementById("DealersHånd").innerHTML += Kortdisplay(UddelteKort, i);
		if (i==0) {
			document.getElementById("DealersHånd").innerHTML += '<div id="SkjultKort" style="left:30%;"></div>';
		};
		NytSæt();

		SpillerKort.push(kortene[UddelteKort]);
		document.getElementById("SpillersHånd").innerHTML += Kortdisplay(UddelteKort, i);
		NytSæt();
	}
	SKortVærdi.innerHTML = CheckSum(SpillerKort);
}

function StartSpil(){
	if (BeløbErIndsat == false) {
		alert("Du skal først indsætte et beløb!");
		return;
	}
	BlandeKort(kortene);
	KortUddeling();
	document.getElementById("StartKnap").disabled = true;
	Penge.innerHTML = SpilPenge;
	document.getElementById("SpilHandlinger").style.display = "block";
	document.getElementById("Double").disabled = false;
}

function Hit() {
	GivKort();
	document.getElementById("Double").disabled = true;
}

function Double() {
	var IndsatVærdi = parseInt(document.getElementById("IndsatBeløb").innerHTML);
		if ((SpilPenge - IndsatVærdi) < 0) {
			alert("Du har ikke penge nok til at double!");
			return;
		}
		else {
			SpilPenge = SpilPenge - IndsatVærdi;
			IndsatVærdi = IndsatVærdi * 2;
		}
		Penge.innerHTML = SpilPenge;
		document.getElementById("IndsatBeløb").innerHTML = IndsatVærdi;
		GivKort();
		SlutSpil();
}

function Stand() {
	SlutSpil();
}


function GivKort() {
	SpillerKort.push(kortene[UddelteKort]);
	document.getElementById("SpillersHånd").innerHTML += Kortdisplay(UddelteKort, (SpillerKort.length - 1));
	NytSæt();
	var SpillerVærdi = CheckSum(SpillerKort);
	SKortVærdi.innerHTML = SpillerVærdi;
	if (SpillerVærdi > 21) {
		Besked.innerHTML = "Du bustede!";
		SlutSpil();
	}
}

function CheckSum(KortHånd) {
	var HoldeVærdi = 0;
	var EsserJustering = false;
	for (var i in KortHånd) {
		if (KortHånd[i].kortnum == "A" && !EsserJustering) {
			EsserJustering = true;
			HoldeVærdi = HoldeVærdi + 10;
		}
		HoldeVærdi = HoldeVærdi + KortHånd[i].kortværdi;
	}

	if (EsserJustering && HoldeVærdi > 21) {
		HoldeVærdi = HoldeVærdi - 10;
	}
	return HoldeVærdi;
} 

function SlutSpil() {
	SpilSlut = true;
	document.getElementById("SkjultKort").style.display = "none";
	document.getElementById("SpilHandlinger").style.display = "none";
	document.getElementById("IndsætKnap").style.display = "block";
	document.getElementById("Beløb").style.display = "block";
	document.getElementById("StartKnap").disabled = false;
	var Udbetaling = 2;
	var DealerVærdi = CheckSum(DealersKort);
	DKortVærdi.innerHTML = DealerVærdi;

	while (DealerVærdi < 17) {
		DealersKort.push(kortene[UddelteKort]);
		document.getElementById("DealersHånd").innerHTML += Kortdisplay(UddelteKort, (DealersKort.length - 1));
		NytSæt();
		DealerVærdi = CheckSum(DealersKort);
		DKortVærdi.innerHTML = DealerVærdi;
	}

	var SpillerensVærdi = CheckSum(SpillerKort);
	if (SpillerensVærdi == 21 && SpillerKort.length == 2) {
		Besked.innerHTML = "Du fik BlackJack, tillykke!";
		Udbetaling = 2.5;
	}

	var PengeTilbage = parseInt(document.getElementById("IndsatBeløb").innerHTML) * Udbetaling;

	BeløbErIndsat = false;

	if ((SpillerensVærdi < 22 && SpillerensVærdi > DealerVærdi) || (DealerVærdi > 21 && SpillerensVærdi < 22)) {
		Besked.innerHTML = "Tillykke, du vandt!";

		SpilPenge = SpilPenge + PengeTilbage;
	}
	else if (SpillerensVærdi > 21) {
		Besked.innerHTML = "Øv, du tabte";
	}
	else if (SpillerensVærdi == DealerVærdi) {
		Besked.innerHTML = "I stod lige";
		SpilPenge = SpilPenge + (PengeTilbage/2);
	}
	else {
		Besked.innerHTML = "Øv, du tabte";
	}

	Penge.innerHTML = SpilPenge;
}
