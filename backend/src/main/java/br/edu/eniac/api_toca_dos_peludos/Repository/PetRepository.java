package br.edu.eniac.api_toca_dos_peludos.Repository;

import br.edu.eniac.api_toca_dos_peludos.Models.Pet;
import br.edu.eniac.api_toca_dos_peludos.Enums.PetPorte;
import br.edu.eniac.api_toca_dos_peludos.Enums.PetStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface PetRepository extends JpaRepository<Pet, Long> {
    @Query("SELECT p FROM Pet p WHERE " +
            "(:tipo IS NULL OR p.tipo = :tipo) AND " +
            "(:raca IS NULL OR p.raca = :raca) AND " +
            "(:porte IS NULL OR p.porte = :porte) AND " +
            "(:cor IS NULL OR p.cor = :cor) AND " +
            "(:status IS NULL OR p.status = :status)")
    List<Pet> findByFilters(@Param("tipo") String tipo,
                            @Param("raca") String raca,
                            @Param("porte") PetPorte porte,
                            @Param("cor") String cor,
                            @Param("status") PetStatus status);
}