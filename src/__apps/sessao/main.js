import Vue from 'vue'
import VueNestable from 'vue-nestable'


console.log("Vue");

var tipo_listas = [];
var parlamentares = [];

for(let l of document.getElementsByName("tipo_lista")){
    tipo_listas.push({'nome': l.value, 'id':l.id})
}

for(let p of document.getElementsByName("parlamentar_ativo")){
    parlamentares.push({'nome': p.value, 'id':p.id})
}

let listas_tmp = [];
var parlamentares_lista = {};
for(let lp of document.getElementsByName("parlamentar_lista")){
    let lista_id = lp.id.split(':')[0];
    let parlamentar_id = lp.id.split(':')[1];
    if(! (Object.keys(parlamentares_lista).includes(lista_id.toString()) )) {
        parlamentares_lista[lista_id] = [];
    }
    parlamentares_lista[lista_id].push(parlamentar_id);
}

console.log(parlamentares_lista);

Vue.use(VueNestable);

var app = new Vue({ 
    delimiters: ['[[', ']]'],
    el: '#app',
    data: {
        lista_selecionada: '',
        tipo_listas: tipo_listas,
        parlamentares: parlamentares,
        parlamentares_selecionados: [],
        parlamentares_lista: parlamentares_lista,
    },
    watch: {
        // whenever question changes, this function will run
        lista_selecionada: function (newQuestion, oldQuestion) {
            this.parlamentares_selecionados = this.parlamentares_lista[this.lista_selecionada.id];
        }
      },
    methods: {
        saveParlamentarLista: function saveParlamentarLista(){
            console.log(this.parlamentares_selecionados);
            let lista_ids_parls = [];
            for(let p of this.parlamentares_selecionados){
                lista_ids_parls.push(p.id);
            }
            let url = window.location.href;
            let sessao_pk = url.split('/')[4];
            $.get("/sistema/salva-listadiscurso-parlamentares/",
            { 
                parlamentares_selecionados: lista_ids_parls,
                lista_selecionada: this.lista_selecionada.id,
                sessao_pk: sessao_pk,
            }, function(data, status) {
                if(status == "success")
                    console.log("Salvo.");
            });
        },
     },
    components: {
    },
});
