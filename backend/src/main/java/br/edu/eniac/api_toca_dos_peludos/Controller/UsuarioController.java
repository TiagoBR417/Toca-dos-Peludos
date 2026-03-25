package br.edu.eniac.api_toca_dos_peludos.Controller;

import br.edu.eniac.api_toca_dos_peludos.Models.Usuario;
import br.edu.eniac.api_toca_dos_peludos.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/cadastro")
    public Usuario cadastrar(@RequestBody Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody Usuario loginData) {
        Optional<Usuario> user = usuarioRepository.findByEmail(loginData.getEmail());
        if (user.isPresent() && user.get().getSenha().equals(loginData.getSenha())) {
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.status(401).build();
    }
}