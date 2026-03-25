package br.edu.eniac.api_toca_dos_peludos.Repository;


import br.edu.eniac.api_toca_dos_peludos.Models.Voluntario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoluntarioRepository extends JpaRepository<Voluntario, Long> {}