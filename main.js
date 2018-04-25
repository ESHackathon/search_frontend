var app = angular.module('search-strategy', []);
    app.controller('relevant', function($scope, $locale, $location, $http, $filter, $interval) {
      $scope.baseURL = "http://localhost";
      $scope.used = [];
      $scope.view = {"selected": "home"};
      $scope.draftString = {"selected": ""};
      $scope.textareaText = {"selected": $scope.draftString.selected};
      $scope.quickLookupText = {"selected": ""};
      $scope.text = {}


      $scope.quickHits = [];
      $scope.hits = [];
      $scope.suggested = [];
      $scope.originalSuggested=[];

      function matchRuleShort(str, rule) {
        return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
      }

      var lastRequestTime = 0;
      var getUsedKeywords = function(search_strategy)
      {
        // if((new Date() - lastRequestTime) < 5000) return;
        lastRequestTime = new Date();
        if(search_strategy){

          if(search_strategy[0] != '(') search_strategy = '(' + search_strategy;
          if(search_strategy[search_strategy.length - 1] != ')') search_strategy + ')';
          $http.post($scope.baseURL + ":5002/search-parser", search_strategy).then(
            function(response){
              $scope.suggested = JSON.parse(JSON.stringify($scope.originalSuggested));
              $scope.used = [];

              var allUsedWords = response.data;
              // var wordsAddedToUsed = [];
              // var unlistedUsedWords = [];


              for(var ind in allUsedWords)
              {
                $scope.used.push({keyWord: allUsedWords[ind], score: ''});
              }

              // for every used keyWord
              for(var ind in allUsedWords)
              {
                var word = allUsedWords[ind];

                var i = $scope.suggested.length;
                while (i--)
                {
                  // if(matchRuleShort($scope.suggested[i].keyWord.toLowerCase(), word.toLowerCase())) // if the used word or truncation is in $scope.suggested, then remove this
                  if($scope.suggested[i].keyWord.toLowerCase().search(word.toLowerCase()) >= 0)
                  {
                      $scope.suggested.splice(i, 1);
                  }
                }

                for(var j in $scope.originalSuggested)
                {
                  var used = $scope.used.map(a => a.keyWord);

                  if($scope.originalSuggested[j].keyWord.toLowerCase().search(word.toLowerCase()) >= 0)
                  {
                    var index = used.indexOf(word);
                    // console.log('word>>>', word, index);
                    if(index < 0)
                    {
                      $scope.used.push($scope.originalSuggested[j]);
                    }
                    else
                    {
                      $scope.used[index] = $scope.originalSuggested[j];
                    }
                  }
                }
              }
            }
          );
        }
      };
      $scope.calculateSearchHits = function(search_strategy, callback){
        if(search_strategy){
          $http.post($scope.baseURL + ":5000/search-count", search_strategy).then(
            function(response){
              var search_counter = response.data;
              search_counter.query = search_strategy;
              callback(null, search_counter);
              // {"pubmed": 222072, "crossref": 1396698}%
            }
          );
        }
      };
      $scope.extractKeywordsFromText = function(text){
        if(text){
          $http.post($scope.baseURL + ":5003/keyword-extraction", text).then(
            function(response){
              var suggested = response.data;
              $scope.suggested = suggested.map(function(suggested_el){
                return {
                  keyWord: suggested_el[0],
                  score: suggested_el[1].toFixed(2), // optional
                  // hits: -1, //optional
                };
              });
              $scope.originalSuggested = JSON.parse(JSON.stringify($scope.suggested));

              getUsedKeywords($scope.textareaText.selected);
              // {"pubmed": 222072, "crossref": 1396698}%
            }
          );
        }
      };

      // Once on load
      // getUsedKeywords($scope.draftString);
      /*calculateSearchHits(
        $scope.draftString.selected,
        function(err, search_counter){
          $scope.hits.push(search_counter);
        }
      );*/




      // $scope.text = {"selected": "History and evolution of the arctic flora: in the footsteps of Eric. A major contribution to our initial understanding of the origin, history and biogeography of the present-day arctic flora was made by Eric Hulten in his landmark book Outline of the History of Arctic and Boreal Biota during the Quarternary Period, published in 1937. Here we review recent molecular and fossil evidence that has tested some of Hulten's proposals. There is now excellent fossil, molecular and phytogeographical evidence to support Hulten's proposal that Beringia was a major northern refugium for arctic plants throughout the Quaternary. In contrast, most molecular evidence fails to support his proposal that contemporary east and west Atlantic populations of circumarctic and amphi-Atlantic species have been separated throughout the Quaternary. In fact, populations of these species from opposite sides of the Atlantic are normally genetically very similar, thus the North Atlantic does not appear to have been a strong barrier to their dispersal during the Quaternary. Hulten made no detailed proposals on mechanisms of speciation in the Arctic; however, molecular studies have confirmed that many arctic plants are allopolyploid, and some of them most probably originated during the Holocene. Recurrent formation of polyploids from differentiated diploid or more low-ploid populations provides one explanation for the intriguing taxonomic complexity of the arctic flora, also noted by Hulten. In addition, population fragmentation during glacial periods may have lead to the formation of new sibling species at the diploid level. Despite the progress made since Hulten wrote his book, there remain large gaps in our knowledge of the history of the arctic flora, especially about the origins of the founding stocks of this flora which first appeared in the Arctic at the end of the Pliocene (approximately 3 Ma). Comprehensive analyses of the molecular phylogeography of arctic taxa and their relatives together with detailed fossil studies are required to fill these gaps. Quantification of population sizes of large herbivores and their long-term functional role in ecosystems using dung fungal spores. The relationship between large herbivore numbers and landscape cover over time is poorly understood. There are two schools of thought: one views large herbivores as relatively passive elements upon the landscape and the other as ecosystem engineers driving vegetation succession. The latter relationship has been used as an argument to support reintroductions of large herbivores onto many landscapes in order to increase vegetation heterogeneity and biodiversity through local-scale disturbance regimes. Most of the research examining the relationship between large herbivores and their impact on landscapes has used extant studies. An alternative approach is to estimate the impact of variations in herbivore populations through time using fossil dung fungal spores and pollen in sedimentary sequences. However, to date, there has been little quantification of fossil dung fungal spore records and their relationship to herbivore numbers, leaving this method open to varied interpretations. In this study, we developed further the dung fungal spore method and determined the relationship between spore abundance in sediments (number cm(-2)year(-1)) and herbivore biomass densities (kgha(-1)). To establish this relationship, we used the following: (i) the abundance of Sporormiella spp., Sordaria spp. and Podospora spp. spores in modern sediments from ponds and (ii) weekly counts of contemporary wildlife over a period of 5years from the rewilded site, Oostvaardersplassen, in the Netherlands. Results from this study demonstrate that there is a highly significant relationship between spore abundance and local biomass densities of herbivores that can be used in the calibration of fossil records. Mammal biomass density (comprising Konik horses, Heck cattle and red deer) predicts in a highly significant way the abundance of all dung fungal spores amalgamated together. This relationship is apparent at a very local scale (<10m), when the characteristics of the sampled ponds are taken into account (surface area of pond, length of shoreline). In addition, we identify that dung fungal spores are principally transported into ponds by surface run-off from the shores. These results indicate that this method provides a robust quantitative measure of herbivore population size over time. Herbivory Network: An international, collaborative effort to study herbivory in Arctic and alpine ecosystems. Plant-herbivore interactions are central to the functioning of tundra ecosystems, but their outcomes vary over space and time. Accurate forecasting of ecosystem responses to ongoing environmental changes requires a better understanding of the processes responsible for this heterogeneity. To effectively address this complexity at a global scale, coordinated research efforts, including multi-site comparisons within and across disciplines, are needed. The Herbivory Network was established as a forum for researchers from Arctic and alpine regions to collaboratively investigate the multifunctional role of herbivores in these changing ecosystems. One of the priorities is to integrate sites, methodologies, and metrics used in previous work, to develop a set of common protocols and design long-term geographically-balanced, coordinated experiments. The implementation of these collaborative research efforts will also improve our understanding of traditional human-managed systems that encompass significant portions of the sub-Arctic and alpine areas worldwide. A deeper understanding of the role of herbivory in these systems under ongoing environmental changes will guide appropriate adaptive strategies to preserve their natural values and related ecosystem services. (C) 2016 Elsevier B.V. and NIPR. All rights reserved. Biomass allometry for alder, dwarf birch, and willow in boreal forest and tundra ecosystems of far northeastern Siberia and north-central Alaska. Shrubs play an important ecological role in the Arctic system, and there is evidence from many Arctic regions of deciduous shrubs increasing in size and expanding into previously forb or graminoid-dominated ecosystems. There is thus a pressing need to accurately quantify regional and temporal variation in shrub biomass in Arctic regions, yet allometric equations needed for deriving biomass estimates from field surveys are rare. We developed 66 allometric equations relating basal diameter (BD) to various aboveground plant characteristics for three tall, deciduous shrub genera growing in boreal and tundra ecoregions in far northeastern Siberia (Yakutia) and north-central Alaska. We related BD to plant height and stem, branch, new growth (leaves + new twigs), and total aboveground biomass for alder (Alms viridis subsp. crispa and Alms fruticosa), dwarf birch (Betula nana subsp. exilis and divaricata), and willow (Salix spp.). The equations were based on measurements of 358 shrubs harvested at 33 sites. Plant height (r(2) = 0.48-0.95), total aboveground biomass (r(2) = 0.46-0.99), and component biomass (r(2) = 0.13-0.99) were significantly (P < 0.01) related to shrub BD. Alder and willow populations exhibited differences in allometric relationships across ecoregions, but this was not the case for dwarf birch. The allometric relationships we developed provide a tool for researchers and land managers seeking to better quantify and monitor the form and function of shrubs across the Arctic landscape. (C) 2014 Elsevier B.V. All rights reserved. Shrub expansion may reduce summer permafrost thaw in Siberian tundra. Climate change is expected to cause extensive vegetation changes in the Arctic: deciduous shrubs are already expanding, in response to climate warming. The results from transect studies suggest that increasing shrub cover will impact significantly on the surface energy balance. However, little is known about the direct effects of shrub cover on permafrost thaw during summer. We experimentally quantified the influence of Betula nana cover on permafrost thaw in a moist tundra site in northeast Siberia with continuous permafrost. We measured the thaw depth of the soil, also called the active layer thickness (ALT), ground heat flux and net radiation in 10 m diameter plots with natural B. nana cover (control plots) and in plots in which B. nana was removed (removal plots). Removal of B. nana increased ALT by 9% on average late in the growing season, compared with control plots. Differences in ALT correlated well with differences in ground heat flux between the control plots and B. nana removal plots. In the undisturbed control plots, we found an inverse correlation between B. nana cover and late growing season ALT. These results suggest that the expected expansion of deciduous shrubs in the Arctic region, triggered by climate warming, may reduce summer permafrost thaw. Increased shrub growth may thus partially offset further permafrost degradation by future temperature increases. Permafrost models need to include a dynamic vegetation component to accurately predict future permafrost thaw. Global assessment of nitrogen deposition effects on terrestrial plant diversity: a synthesis. Atmospheric nitrogen (N) deposition is it recognized threat to plant diversity ill temperate and northern parts of Europe and North America. This paper assesses evidence from field experiments for N deposition effects and thresholds for terrestrial plant diversity protection across a latitudinal range of main categories of ecosystems. from arctic and boreal systems to tropical forests. Current thinking on the mechanisms of N deposition effects on plant diversity, the global distribution of G200 ecoregions, and current and future (2030) estimates of atmospheric N-deposition rates are then used to identify the risks to plant diversity in all major ecosystem types now and in the future. This synthesis paper clearly shows that N accumulation is the main driver of changes to species composition across the whole range of different ecosystem types by driving the competitive interactions that lead to composition change and/or making conditions unfavorable for some species. Other effects such its direct toxicity of nitrogen gases and aerosols long-term negative effects of increased ammonium and ammonia availability, soil-mediated effects of acidification, and secondary stress and disturbance are more ecosystem, and site-specific and often play a supporting role. N deposition effects in mediterranean ecosystems have now been identified, leading to a first estimate of an effect threshold. Importantly, ecosystems thought of as not N limited, such as tropical and subtropical systems, may be more vulnerable in the regeneration phase. in situations where heterogeneity in N availability is reduced by atmospheric N deposition, on sandy soils, or in montane areas. Critical loads are effect thresholds for N deposition. and the critical load concept has helped European governments make progress toward reducing N loads on sensitive ecosystems. More needs to be done in Europe and North America. especially for the more sensitive ecosystem types. including several ecosystems of high conservation importance. The results of this assessment Show that the Vulnerable regions outside Europe and North America which have not received enough attention are ecoregions in eastern and Southern Asia (China, India), an important part of the mediterranean ecoregion (California, southern Europe). and in the coming decades several subtropical and tropical parts of Latin America and Africa. Reductions in plant diversity by increased atmospheric N deposition may be more widespread than first thought, and more targeted Studies are required in low background areas, especially in the G200 ecoregions. Meta-analysis of high-latitude nitrogen-addition and warming studies implies ecological mechanisms overlooked by land models. Accurate representation of ecosystem processes in land models is crucial for reducing predictive uncertainty in energy and greenhouse gas feedbacks with the climate. Here we describe an observational and modeling meta-analysis approach to benchmark land models, and apply the method to the land model CLM4.5 with two versions of belowground biogeochemistry. We focused our analysis on the aboveground and belowground responses to warming and nitrogen addition in high-latitude ecosystems, and identified absent or poorly parameterized mechanisms in CLM4.5. While the two model versions predicted similar soil carbon stock trajectories following both warming and nitrogen addition, other predicted variables (e.g., belowground respiration) differed from observations in both magnitude and direction, indicating that CLM4.5 has inadequate underlying mechanisms for representing high-latitude ecosystems. On the basis of observational synthesis, we attribute the model-observation differences to missing representations of microbial dynamics, aboveground and belowground coupling, and nutrient cycling, and we use the observational meta-analysis to discuss potential approaches to improving the current models. However, we also urge caution concerning the selection of data sets and experiments for meta-analysis. For example, the concentrations of nitrogen applied in the synthesized field experiments (average = 72 kg ha(-1) yr(-1)) are many times higher than projected soil nitrogen concentrations (from nitrogen deposition and release during mineralization), which precludes a rigorous evaluation of the model responses to likely nitrogen perturbations. Overall, we demonstrate that elucidating ecological mechanisms via meta-analysis can identify deficiencies in ecosystem models and empirical experiments."};
      /*extractKeywordsFromText(text);*/




    $scope.$watch('textareaText.selected', function (newValue, oldValue) {
      if(!newValue || !oldValue) return;

      if(newValue.length != oldValue.length)
      {
        getUsedKeywords($scope.textareaText.selected);
        // $scope.evaluateUsedKeywords();
      }
    });

    $scope.calculateQuickHitCount = function() {
      $scope.quickHits = [];
      $scope.quickLookuploading = true;
      $scope.calculateSearchHits(
        $scope.quickLookupText.selected,
        function(err, search_counter){
          $scope.quickHits.push(search_counter);
          $scope.quickLookuploading = false;
        }
      );
    };

    $scope.calculateSearchCount = function() {
      getUsedKeywords($scope.textareaText.selected);

      $scope.loading = true;
      $scope.calculateSearchHits(
        $scope.textareaText.selected,
        function(err, search_counter){
          $scope.hits.push(search_counter);
          $scope.loading = false;
        }
      );
    };
  });
