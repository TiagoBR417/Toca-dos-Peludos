package br.edu.eniac.api_toca_dos_peludos.Controller;


import br.edu.eniac.api_toca_dos_peludos.Models.Pet;
import br.edu.eniac.api_toca_dos_peludos.Enums.PetPorte;
import br.edu.eniac.api_toca_dos_peludos.Enums.PetStatus;
import br.edu.eniac.api_toca_dos_peludos.Repository.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin(origins = "*")
public class PetController {

    @Autowired
    private PetRepository petRepository;

    @GetMapping
    public List<Pet> listarPets(
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String raca,
            @RequestParam(required = false) PetPorte porte,
            @RequestParam(required = false) String cor) {
        return petRepository.findByFilters(tipo, raca, porte, cor, PetStatus.DISPONIVEL);
    }

    @GetMapping("/admin")
    public List<Pet> listarTodosAdmin() {
        return petRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pet> buscarPorId(@PathVariable Long id) {
        return petRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Pet cadastrarPet(@RequestBody Pet pet) {
        if (pet.getStatus() == null) {
            pet.setStatus(PetStatus.DISPONIVEL);
        }
        return petRepository.save(pet);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pet> atualizarPet(@PathVariable Long id, @RequestBody Pet petDetails) {
        return petRepository.findById(id)
                .map(pet -> {
                    pet.setNome(petDetails.getNome());
                    pet.setTipo(petDetails.getTipo());
                    pet.setRaca(petDetails.getRaca());
                    pet.setPorte(petDetails.getPorte());
                    pet.setCor(petDetails.getCor());
                    pet.setImagemUrl(petDetails.getImagemUrl());
                    pet.setStatus(petDetails.getStatus());
                    return ResponseEntity.ok(petRepository.save(pet));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Pet> atualizarStatus(@PathVariable Long id, @RequestParam PetStatus status) {
        return petRepository.findById(id)
                .map(pet -> {
                    pet.setStatus(status);
                    return ResponseEntity.ok(petRepository.save(pet));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPet(@PathVariable Long id) {
        petRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}