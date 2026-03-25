package br.edu.eniac.api_toca_dos_peludos.Controller;

import br.edu.eniac.api_toca_dos_peludos.Models.Denuncia;
import br.edu.eniac.api_toca_dos_peludos.Repository.DenunciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/denuncias")
@CrossOrigin(origins = "*")
public class DenunciaController {

    @Autowired
    private DenunciaRepository denunciaRepository;

    @PostMapping
    public Denuncia criarDenuncia(@RequestBody Denuncia denuncia) {
        return denunciaRepository.save(denuncia);
    }

    @GetMapping
    public List<Denuncia> listarDenuncias() {
        return denunciaRepository.findAll();
    }
}