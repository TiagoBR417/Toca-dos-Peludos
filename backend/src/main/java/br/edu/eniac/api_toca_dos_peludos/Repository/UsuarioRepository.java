package br.edu.eniac.api_toca_dos_peludos.Repository;


import br.edu.eniac.api_toca_dos_peludos.Models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
}