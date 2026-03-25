package br.edu.eniac.api_toca_dos_peludos.Controller;

import br.edu.eniac.api_toca_dos_peludos.Models.Evento;
import br.edu.eniac.api_toca_dos_peludos.Repository.EventoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/eventos")
@CrossOrigin(origins = "*")
public class EventoController {

    @Autowired
    private EventoRepository eventoRepository;

    @GetMapping
    public List<Evento> listarEventos() {
        return eventoRepository.findAll();
    }

    @PostMapping
    public Evento criarEvento(@RequestBody Evento evento) {
        return eventoRepository.save(evento);
    }
}