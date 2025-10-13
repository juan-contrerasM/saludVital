import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from datetime import datetime
from modelo.citas_model import validar_datos_cita


# 🟢 Casos válidos
def test_validar_datos_cita_valido():
    ok, errores = validar_datos_cita("pac001", "2025-10-10", "14:30:00", "Chequeo general")
    assert ok is True
    assert errores is None


@pytest.mark.parametrize("paciente_id,fecha,hora,motivo", [
    ("u001", "2025-12-01", "09:00:00", "Dolor de cabeza"),
    ("abc123", "2025-01-15", "23:59:59", "Consulta médica"),
])
def test_validaciones_validas_parametrizadas(paciente_id, fecha, hora, motivo):
    ok, errores = validar_datos_cita(paciente_id, fecha, hora, motivo)
    assert ok is True
    assert errores is None


# 🔴 ID del paciente inválido
@pytest.mark.parametrize("paciente_id", ["", None, 123])
def test_paciente_id_invalido(paciente_id):
    ok, errores = validar_datos_cita(paciente_id, "2025-10-10", "14:30:00", "Chequeo")
    assert ok is False
    assert any("ID del paciente" in e for e in errores)


# 🔴 Motivo inválido
@pytest.mark.parametrize("motivo", ["", "  ", "ok"])
def test_motivo_invalido(motivo):
    ok, errores = validar_datos_cita("pac001", "2025-10-10", "14:30:00", motivo)
    assert ok is False
    assert any("motivo" in e.lower() for e in errores)


# 🔴 Fecha inválida
@pytest.mark.parametrize("fecha", [
    "10-10-2025", "2025/10/10", "2025-13-01", "2025-02-30", "20251010"
])
def test_fecha_invalida(fecha):
    ok, errores = validar_datos_cita("pac001", fecha, "14:30:00", "Chequeo")
    assert ok is False
    assert any("fecha" in e.lower() for e in errores)


# 🔴 Hora inválida
@pytest.mark.parametrize("hora", [
    "2:30 PM", "14:3:00", "25:00:00", "14-30-00", "143000"
])
def test_hora_invalida(hora):
    ok, errores = validar_datos_cita("pac001", "2025-10-10", hora, "Chequeo")
    assert ok is False
    assert any("hora" in e.lower() for e in errores)


# 🔴 Múltiples errores a la vez
def test_multiples_errores():
    ok, errores = validar_datos_cita("", "2025-13-40", "25:00:00", "")
    assert ok is False
    assert len(errores) >= 3


# 🟡 Casos límite válidos
@pytest.mark.parametrize("paciente_id,fecha,hora,motivo", [
    ("a", "2025-01-01", "00:00:00", "okey"),
    ("Z9", "2025-12-31", "23:59:59", "control")
])
def test_casos_limite_validos(paciente_id, fecha, hora, motivo):
    ok, errores = validar_datos_cita(paciente_id, fecha, hora, motivo)
    assert ok is True
    assert errores is None