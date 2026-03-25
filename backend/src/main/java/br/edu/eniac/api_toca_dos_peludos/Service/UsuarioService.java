package br.edu.eniac.api_toca_dos_peludos.Service;

import br.edu.eniac.api_toca_dos_peludos.Models.Usuario;

import java.util.List;

public interface UsuarioService {
    Usuario salvar(Usuario usuario);
    List<Usuario> listarTodos();
    void excluir(Long id, Usuario executor);//somente ADM pode deletar


}
