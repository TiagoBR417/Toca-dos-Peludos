package br.edu.eniac.api_toca_dos_peludos.Service;

import br.edu.eniac.api_toca_dos_peludos.Enums.PetPorte;
import br.edu.eniac.api_toca_dos_peludos.Enums.PetStatus;
import br.edu.eniac.api_toca_dos_peludos.Models.Pet;
import br.edu.eniac.api_toca_dos_peludos.Repository.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PetService {

    public List<Pet> listarComFiltros(String tipo, String raca, PetPorte porte, String cor) {
    return petRepository.findByFilters(tipo, raca, porte, cor, PetStatus.DISPONIVEL);
     }

    @Autowired
    private PetRepository petRepository;

    
    public List<Pet> listarTodos() {
        return petRepository.findAll();
    }

    
    public Pet salvar(Pet pet) {
        
        return petRepository.save(pet);
    }

    
    public Optional<Pet> buscarPorId(Long id) {
        return petRepository.findById(id);
    }

    
    public void excluir(Long id) {
        petRepository.deleteById(id);
    }
}