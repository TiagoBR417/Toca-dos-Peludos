package br.edu.eniac.api_toca_dos_peludos.Controller;

import br.edu.eniac.api_toca_dos_peludos.Models.Doacao;
import br.edu.eniac.api_toca_dos_peludos.Repository.DoacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/docaoes")
@CrossOrigin(origins = "*")
public class DoacaoController {

    @Autowired
    private DoacaoRepository doacaoRepository;

    @PostMapping
    public Doacao registrarDoacao(@RequestBody Doacao doacao){
        return doacaoRepository.save(doacao);
    }

    @GetMapping
    public List<Doacao> listarDoacao(){
        return doacaoRepository.findAll();
    }
}
