@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AuthenticationManager manager; //inicia o  Spring Security

    @Autowired
    private TokenService tokenService; //service do toke

    @Autowired
    private PasswordEncoder passwordEncoder; 

    @PostMapping("/cadastro")
    public ResponseEntity cadastrar(@RequestBody Usuario usuario) {
        //criptografa a senha 
        String senhaCriptografada = passwordEncoder.encode(usuario.getSenha());
        usuario.setSenha(senhaCriptografada);
        
        usuarioRepository.save(usuario);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody Usuario loginData) {
        //objeto do SpringSecurity para validar as credenciais
        var authenticationToken = new UsernamePasswordAuthenticationToken(loginData.getEmail(), loginData.getSenha());
        
       
        var authentication = manager.authenticate(authenticationToken);
        
        //gera o token
        var tokenJWT = tokenService.gerarToken((Usuario) authentication.getPrincipal());

        //retorna o DTO para o front
        return ResponseEntity.ok(new DadosTokenJWT(tokenJWT));
    }
}

//salva o DTO
record DadosTokenJWT(String token) {}