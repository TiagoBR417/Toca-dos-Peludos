package br.edu.eniac.api_toca_dos_peludos.Models;

import br.edu.eniac.api_toca_dos_peludos.Enums.PetPorte;
import br.edu.eniac.api_toca_dos_peludos.Enums.PetStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "tb_pets")
public class Pet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String tipo;
    private String raca;

    @Enumerated(EnumType.STRING)
    private PetPorte porte;

    private String cor;
    private String imagemUrl;
    private String descricao;

    @Enumerated(EnumType.STRING)
    private PetStatus status;
}