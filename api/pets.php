<?php
//menu de gerado depois de clicar no cards
foreach ($voluntarios as $v) {
    echo "<tr>
            <td><img src='uploads/{$v['foto']}' /></td>
            <td>{$v['nome']}</td>
            <td>{$v['idade']}</td>
            <td>{$v['genero']}</td>
            <td>{$v['cargo']}</td>
          </tr>";
}
?>