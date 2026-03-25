package br.edu.eniac.api_toca_dos_peludos.Repository;



import br.edu.eniac.api_toca_dos_peludos.Models.Denuncia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DenunciaRepository extends JpaRepository<Denuncia, Long> {}