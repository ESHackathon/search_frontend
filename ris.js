var get_parts = function(ris_file_text){
    ris_text_parts = ris_file_text.split(/'\nER  - '/);
    if(ris_text_parts.length == 1){
        ris_text_parts = ris_file_text.split(/\r?\n\r?\n/);
    }
    if(ris_text_parts.length == 1){
        ris_file_text = ris_file_text.replace(/'\r'/g, '\n');
        ris_text_parts = ris_file_text.split(/\n\n\n/g);
    }
    return ris_text_parts.map(function(el){return el.trim();});
};

var get_title_abstract = function(ris_file_text){
	var found_match = "";
	regex = new RegExp(/^\s*([A-Z][A-Z0-9]{1,3})\s+[-](.*)/);
	var references = get_parts(ris_file_text);
	var all_references = [];
	for (var i = 0; i < references.length; i++) {
		var reference_info = {};
		var reference_lines = references[i].split("\n");
		var tag = "";
		var tmp_text = "";
		for (var j = 0; j < reference_lines.length; j++) {
			var matched = regex.exec(reference_lines[j]);
			if(matched){
				if(tmp_text){
					reference_info[tag] = tmp_text;
				}
				tag = matched[1];
				tmp_text = matched[2];
			}else{
				tmp_text += reference_lines[j];
			}
		}
		var title = ['T1', 'TI', 'CT', 'BT', 'TT'].map(function(tag){return reference_info[tag] || "";}).filter(function(el){ return el;}).join("").trim();
		var abstract = ['AB', 'N2'].map(function(tag){return reference_info[tag] || "";}).join("").trim();
		if(title && abstract)
			all_references.push({title: title, abstract: abstract});
	}
	return all_references;
};

var text = `TY  - JOUR
TI  - Clinical pathways.
AU  - Kitchiner DJ
AU  - Bundred PE
AB  -
LA  - English
T2  - The Medical journal of Australia
VL  - 170
SP  - 54-5
IS  - 2
SN  - 0025-729X
PY  - 1999
DA  - 1999/01/18
DB  - EPISTEMONIKOS
UR  - http://www.epistemonikos.org/documents/b45cfa6f057184644c48096a29b5c09f10f5d75d
ER  -

TY  - JOUR
TI  - A clinical librarian can support clinical governance
AU  - Linda M.
AU  - Claire J. Honeybourne
AU  - Janet Harrison
AB  - Tests the feasibility of an outreach clinical librarian service in an acute hospital setting, providing quality filtered research evidence at the point of clinical need. The design was based on a six‐month pilot with professional librarians attending clinical meetings responding to information needs raised there by providing appraised summaries of the published evidence, with full text and bibliographic material as appropriate. The main outcomes were usage statistics and clinicians’ evaluation via a 23‐question questionnaire completed each month seeking overall views of the service. Practical issues regarding the provision of the service were tested. Concludes that an outreach information service in the clinical setting can meet the clinical governance agenda of the Trust by supporting evidence‐based practice, teaching and learning and continuing professional development. Earlier models of service are adapted to make the service cost‐effective.
LA  - English
T2  - British Journal of Clinical Governance
VL  - 6
SP  - 248-251
IS  - 4
SN  - 1466-4100
PY  - 2001
DA  - 2001/12/01/
DO  - 10.1108/EUM0000000006049
DB  - EPISTEMONIKOS
UR  - http://www.epistemonikos.org/documents/6199faa3c15b9ef1f6d3082c0d577f1c93407cac
ER  -

`
// console.log(get_title_abstract(text));
