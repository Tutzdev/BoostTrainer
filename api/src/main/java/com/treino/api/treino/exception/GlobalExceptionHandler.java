package com.treino.api.treino.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<ErroResponse> tratarRecursoNaoEncontrado(RecursoNaoEncontradoException ex) {
        var erro = new ErroResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidacaoErroResponse> tratarErroDeValidacao(MethodArgumentNotValidException ex) {
        Map<String, String> campos = new LinkedHashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(fieldError ->
                campos.put(fieldError.getField(), fieldError.getDefaultMessage())
        );

        var erro = new ValidacaoErroResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Erro de validação",
                campos
        );

        return ResponseEntity.badRequest().body(erro);
    }
}
