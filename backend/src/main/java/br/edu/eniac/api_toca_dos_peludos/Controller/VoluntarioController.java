package br.edu.eniac.api_toca_dos_peludos.Controller;

import br.edu.eniac.api_toca_dos_peludos.Models.Voluntario;
import br.edu.eniac.api_toca_dos_peludos.Repository.VoluntarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/voluntarios")
@CrossOrigin(origins = "*")
public class VoluntarioController {

    @Autowired
    private VoluntarioRepository voluntarioRepository;

    @PostMapping
    public Voluntario cadastrarVoluntario(@RequestBody Voluntario voluntario) {
        return voluntarioRepository.save(voluntario);
    }

    @GetMapping
    public List<Voluntario> listarVoluntarios() {
        return voluntarioRepository.findAll();
    }
}