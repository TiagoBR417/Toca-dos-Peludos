package br.edu.eniac.api_toca_dos_peludos.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

import org.springframework.web.bind.annotation.CrossOrigin;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
public class Doacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nomeDoador;
    private String emailDoador;
    private Double valor;
    private LocalDate dataDoacao;

    @PrePersist
    public void prePersist(){
        this.dataDoacao = LocalDate.now();
    }
}
