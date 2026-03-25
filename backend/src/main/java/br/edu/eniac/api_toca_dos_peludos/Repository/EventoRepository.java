package br.edu.eniac.api_toca_dos_peludos.Repository;



import br.edu.eniac.api_toca_dos_peludos.Models.Evento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventoRepository extends JpaRepository<Evento, Long> {}