package br.edu.eniac.api_toca_dos_peludos.Models;

import br.edu.eniac.api_toca_dos_peludos.Enums.TipoUsuario;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tb_usuarios_db")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    @Column(unique = true)
    private String email;
    private String senha;
    private String endereco;
    private String preferencias;

    @Enumerated(EnumType.STRING)
    private TipoUsuario tipo = TipoUsuario.CLIENTE;
}